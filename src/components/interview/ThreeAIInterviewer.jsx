import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm'

/*
  ThreeAIInterviewer (Phase 14) - human-like 3D interviewer.

  Model priority (public/assets/interview/):
    1. avatar-female-interviewer.vrm   (VRoid/RPM VRM) - expressions via VRM
    2. avatar-female-interviewer.glb   (Avaturn/RPM GLB) - blendshapes + idle clip
    3. geometry bust                   (never an image)

  Mouth moves with the AI's real audio (analyser amplitude) when speaking, via the
  model's jaw/mouth blendshape (GLB) or 'aa' expression (VRM). Also blinks, plays the
  idle animation if present, and moves the head for nod/listen/think.

  Honest limit: this is amplitude-driven open/close, not word-accurate viseme lip-sync.
*/

const VRM_URL = '/assets/interview/avatar-female-interviewer.vrm'
const GLB_URL = '/assets/interview/avatar-female-interviewer.glb'

const amp = (analyser, buf) => {
  if (!analyser) return 0
  analyser.getByteFrequencyData(buf)
  return Math.min(1, (buf.reduce((a, b) => a + b, 0) / buf.length) / 90)
}

// ---------- VRM ----------
function VRMAvatar({ url, stateRef, analyserRef }) {
  const gltf = useLoader(GLTFLoader, url, (loader) => loader.register((p) => new VRMLoaderPlugin(p)))
  const vrm = gltf.userData.vrm
  const blink = useRef({ next: 2, start: -10 })
  const buf = useMemo(() => new Uint8Array(128), [])

  useEffect(() => {
    if (!vrm) return
    try { VRMUtils.rotateVRM0(vrm) } catch { /* VRM1 faces camera */ }
  }, [vrm])

  useFrame((state, delta) => {
    if (!vrm) return
    const t = state.clock.elapsedTime
    const s = stateRef.current
    const em = vrm.expressionManager
    if (em) {
      if (t > blink.current.next) { blink.current.start = t; blink.current.next = t + 2 + Math.random() * 3.5 }
      const since = t - blink.current.start
      em.setValue('blink', since >= 0 && since < 0.13 ? Math.sin((since / 0.13) * Math.PI) : 0)
      const level = amp(analyserRef.current, buf)
      em.setValue('aa', s === 'speaking' ? Math.max(0.04, level * 1.3) : 0)
      em.setValue('happy', s === 'smile' ? 0.7 : 0)
    }
    const head = vrm.humanoid?.getNormalizedBoneNode('head')
    if (head) {
      let rx = Math.sin(t * 0.8) * 0.03, rz = 0
      if (s === 'thinking') { rz = 0.18; rx = -0.06 }
      else if (s === 'listening') rx = 0.08
      else if (s === 'nod') rx = Math.sin(t * 7) * 0.15
      head.rotation.x += (rx - head.rotation.x) * 0.1
      head.rotation.z += (rz - head.rotation.z) * 0.08
      head.rotation.y = Math.sin(t * 0.5) * 0.05
    }
    vrm.update(delta)
  })
  if (!vrm) return null
  return <primitive object={gltf.scene} position={[0, -1.25, 0]} />
}

// ---------- GLB (Avaturn / RPM) ----------
function findMorph(dict, names) {
  for (const n of names) if (n in dict) return dict[n]
  const keys = Object.keys(dict)
  for (const k of keys) if (names.some((n) => k.toLowerCase().includes(n.toLowerCase()))) return dict[k]
  return -1
}

function GLTFAvatar({ url, stateRef, analyserRef }) {
  const group = useRef()
  const { scene, animations } = useGLTF(url)
  const { actions, names } = useAnimations(animations, group)
  const buf = useMemo(() => new Uint8Array(128), [])
  const blink = useRef({ next: 2, start: -10 })
  const smoothed = useRef(0)

  // collect mouth / blink / smile morph targets + head bone
  const rig = useMemo(() => {
    const mouth = [], blinkT = [], smile = []
    let head = null, neck = null
    scene.traverse((o) => {
      if (o.isBone && !head && /head/i.test(o.name)) head = o
      if (o.isBone && !neck && /neck/i.test(o.name)) neck = o
      if (o.isMesh && o.morphTargetDictionary && o.morphTargetInfluences) {
        const d = o.morphTargetDictionary
        const m = findMorph(d, ['jawOpen', 'mouthOpen', 'viseme_aa', 'aa', 'jaw_open'])
        if (m >= 0) mouth.push([o, m])
        const bl = findMorph(d, ['eyeBlinkLeft', 'eyesClosed', 'blink', 'eye_close', 'eyeBlink_L'])
        if (bl >= 0) blinkT.push([o, bl])
        const br = findMorph(d, ['eyeBlinkRight', 'eyeBlink_R'])
        if (br >= 0) blinkT.push([o, br])
        const sm = findMorph(d, ['mouthSmile', 'mouthSmileLeft', 'happy', 'smile'])
        if (sm >= 0) smile.push([o, sm])
      }
    })
    return { mouth, blinkT, smile, head, neck }
  }, [scene])

  useEffect(() => {
    if (group.current) group.current.userData.baseY = -1.5
    const idle = names.find((n) => /idle|breath|stand/i.test(n)) || names[0]
    idle && actions[idle]?.reset().fadeIn(0.4).play()
    return () => { Object.values(actions || {}).forEach((a) => a?.fadeOut(0.2)) }
  }, [actions, names])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const s = stateRef.current
    if (group.current) group.current.position.y = (group.current.userData.baseY ?? -1.5) + Math.sin(t * 1.3) * 0.015

    // mouth from audio
    const level = amp(analyserRef.current, buf)
    smoothed.current = smoothed.current * 0.6 + level * 0.4
    const open = s === 'speaking' ? Math.min(0.9, 0.1 + smoothed.current * 1.6) : 0
    rig.mouth.forEach(([o, i]) => { o.morphTargetInfluences[i] += (open - o.morphTargetInfluences[i]) * 0.5 })

    // blink
    if (t > blink.current.next) { blink.current.start = t; blink.current.next = t + 2 + Math.random() * 3.5 }
    const since = t - blink.current.start
    const bv = since >= 0 && since < 0.13 ? Math.sin((since / 0.13) * Math.PI) : 0
    rig.blinkT.forEach(([o, i]) => { o.morphTargetInfluences[i] = bv })

    // smile
    const sv = s === 'smile' ? 0.6 : 0
    rig.smile.forEach(([o, i]) => { o.morphTargetInfluences[i] += (sv - o.morphTargetInfluences[i]) * 0.1 })

    // head + neck bone motion (gives life even when the model has no face shapes)
    if (rig.head) {
      let rx = Math.sin(t * 0.8) * 0.02, ry = Math.sin(t * 0.5) * 0.04, rz = 0
      if (s === 'thinking') { rz = 0.16; rx = -0.05 }
      else if (s === 'listening') rx = 0.07
      else if (s === 'nod') rx = Math.sin(t * 7) * 0.14
      else if (s === 'speaking') {
        rx += smoothed.current * 0.14 * Math.sin(t * 8) + smoothed.current * 0.05
        ry += smoothed.current * 0.07 * Math.sin(t * 5)
      }
      rig.head.rotation.x += (rx - rig.head.rotation.x) * 0.12
      rig.head.rotation.y += (ry - rig.head.rotation.y) * 0.1
      rig.head.rotation.z += (rz - rig.head.rotation.z) * 0.08
      if (rig.neck) {
        rig.neck.rotation.x += (rx * 0.5 - rig.neck.rotation.x) * 0.1
        rig.neck.rotation.y += (ry * 0.5 - rig.neck.rotation.y) * 0.1
      }
    }
  })
  return <primitive ref={group} object={scene} position={[0, -1.5, 0]} scale={1.0} />
}

// ---------- geometry bust fallback ----------
function FallbackBust({ stateRef }) {
  const group = useRef(); const head = useRef(); const mouth = useRef()
  useFrame((state) => {
    const t = state.clock.elapsedTime; const s = stateRef.current
    if (group.current) group.current.position.y = -0.5 + Math.sin(t * 1.3) * 0.02
    if (head.current) {
      let rx = 0, rz = 0, bob = 0
      if (s === 'thinking') { rz = 0.14; rx = -0.05 }
      else if (s === 'listening') rx = 0.07
      else if (s === 'nod') rx = Math.sin(t * 7) * 0.12
      else if (s === 'speaking') bob = Math.sin(t * 6) * 0.035
      head.current.rotation.z += (rz - head.current.rotation.z) * 0.06
      head.current.rotation.x += (rx + bob - head.current.rotation.x) * 0.1
      head.current.rotation.y = Math.sin(t * 0.6) * 0.05
    }
    if (mouth.current) {
      const open = s === 'speaking' ? (0.5 + 0.5 * Math.sin(t * 12)) * 0.16 + 0.02 : 0.02
      mouth.current.scale.y += (open / 0.05 - mouth.current.scale.y) * 0.4
    }
  })
  return (
    <group ref={group} position={[0, -0.5, 0]}>
      <mesh position={[0, -1.05, 0]}><cylinderGeometry args={[0.6, 0.82, 1.1, 40]} /><meshStandardMaterial color="#26324c" /></mesh>
      <mesh position={[0, -0.42, 0]}><cylinderGeometry args={[0.15, 0.19, 0.28, 24]} /><meshStandardMaterial color="#e0a980" /></mesh>
      <group ref={head} position={[0, 0.08, 0]}>
        <mesh><sphereGeometry args={[0.42, 48, 48]} /><meshStandardMaterial color="#edb98f" /></mesh>
        <mesh position={[0, 0.06, -0.02]} scale={[1.12, 1.14, 1.12]}><sphereGeometry args={[0.42, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.62]} /><meshStandardMaterial color="#3a2a20" /></mesh>
        <mesh position={[-0.15, 0.05, 0.37]}><sphereGeometry args={[0.045, 16, 16]} /><meshStandardMaterial color="#2b2b2b" /></mesh>
        <mesh position={[0.15, 0.05, 0.37]}><sphereGeometry args={[0.045, 16, 16]} /><meshStandardMaterial color="#2b2b2b" /></mesh>
        <mesh ref={mouth} position={[0, -0.18, 0.39]}><boxGeometry args={[0.17, 0.05, 0.02]} /><meshStandardMaterial color="#7a3b3b" /></mesh>
      </group>
    </group>
  )
}

async function detectModel() {
  const isGltf = async (url) => {
    try {
      const r = await fetch(url); if (!r.ok) return false
      if ((r.headers.get('content-type') || '').includes('text/html')) return false
      const m = new Uint8Array((await r.arrayBuffer()).slice(0, 4))
      return m[0] === 0x67 && m[1] === 0x6c && m[2] === 0x54 && m[3] === 0x46
    } catch { return false }
  }
  if (await isGltf(VRM_URL)) return 'vrm'
  if (await isGltf(GLB_URL)) return 'glb'
  return 'none'
}

const ThreeAIInterviewer = ({ avatarState = 'idle', analyser = null }) => {
  const stateRef = useRef(avatarState); stateRef.current = avatarState
  const analyserRef = useRef(analyser); analyserRef.current = analyser
  const [modelType, setModelType] = useState(null)

  useEffect(() => {
    let alive = true
    detectModel().then((m) => {
      if (!alive) return
      setModelType(m)
      if (m === 'none') console.warn('[ThreeAIInterviewer] No .vrm/.glb in /assets/interview/ — using placeholder bust.')
    })
    return () => { alive = false }
  }, [])

  return (
    <Canvas camera={{ position: [0, 0.5, 2.6], fov: 26 }} gl={{ alpha: true, antialias: true }}
      style={{ background: 'transparent' }} dpr={[1, 2]}>
      <ambientLight intensity={1.5} />
      <hemisphereLight args={['#ffffff', '#9aa0b5', 1.1]} />
      <directionalLight position={[2.5, 4, 4]} intensity={1.7} />
      <directionalLight position={[-3, 2, 2]} intensity={0.8} color="#ffe6c8" />
      <directionalLight position={[0, 2, -4]} intensity={0.5} />
      <Suspense fallback={null}>
        {modelType === 'vrm' && <VRMAvatar url={VRM_URL} stateRef={stateRef} analyserRef={analyserRef} />}
        {modelType === 'glb' && <GLTFAvatar url={GLB_URL} stateRef={stateRef} analyserRef={analyserRef} />}
        {modelType === 'none' && <FallbackBust stateRef={stateRef} />}
      </Suspense>
    </Canvas>
  )
}

export default ThreeAIInterviewer
