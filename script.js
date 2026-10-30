import { initBrain3D } from './brain3d.js';

const Y = { cx: 26, olf: 52, bg: 70, th: 104, mb: 160, po: 216, rm: 272, mm: 318, cm: 362, cd: 420, cs: 486, cb: 240 };
const X = { L: 62, R: 138, E: 186, O: 20 };

const T = [
  { id: "dc", n: "Dorsal column (gracilis & cuneatus)", d: "a", p: "L:cs L:mm", loc: {},
    o: "Large-diameter primary afferents (cell bodies in dorsal root ganglia). Gracilis: below T6 (leg); cuneatus: T6 and above (arm).", c: "Ascend ipsilaterally in the dorsal funiculus with no synapse in the cord.", x: "None at this stage (second-order fibres cross in the medulla).", t: "Nucleus gracilis and nucleus cuneatus, caudal/mid medulla.", f: "Fine touch, vibration, conscious proprioception, two-point discrimination.", l: "Ipsilateral loss below the lesion, positive Romberg, sensory ataxia (tabes dorsalis, B12 deficiency)." },
  { id: "ast", n: "Anterior spinothalamic", d: "a", p: "L:cs R:cs R:cm R:mm R:rm R:po R:mb R:th R:cx", loc: { c: [[36, 158, 6, 9]] },
    o: "Second-order neurons in dorsal horn (laminae I, V–VII) after Aδ/C afferent input.", c: "Ascends in the anterior funiculus; becomes part of the spinal lemniscus in the brainstem.", x: "Anterior white commissure, 1–2 segments above entry.", t: "VPL thalamus, then S1 (also reticular formation).", f: "Crude touch and pressure.", l: "Contralateral mild loss of crude touch; usually masked by intact dorsal columns." },
  { id: "lst", n: "Lateral spinothalamic", d: "a", p: "L:cs R:cs R:cm R:mm R:rm R:po R:mb R:th R:cx", loc: { c: [[68, 140, 7, 10]] },
    o: "Dorsal horn laminae I, V (second order) after Aδ/C pain and temperature afferents.", c: "Ascends in the lateral funiculus (somatotopic: sacral lateral, cervical medial).", x: "Anterior white commissure, 1–2 segments above entry.", t: "VPL thalamus (via spinal lemniscus), then S1/insula/cingulate.", f: "Sharp pain and temperature.", l: "Contralateral pain/temperature loss starting 1–2 segments below the lesion. Syringomyelia: cape-like bilateral loss. Brown-Séquard: contralateral loss, ipsilateral weakness and dorsal-column loss." },
  { id: "dsc", n: "Dorsal spinocerebellar", d: "a", p: "L:cd L:cm L:mm E:cb", loc: {},
    o: "Clarke’s nucleus (C8–L3) receiving muscle spindle / Golgi tendon afferents from leg and trunk.", c: "Ipsilateral dorsolateral funiculus, then the inferior cerebellar peduncle.", x: "None (uncrossed).", t: "Ipsilateral cerebellar vermis/paravermis (spinocerebellum).", f: "Unconscious proprioception for coordination.", l: "Ipsilateral limb ataxia (Friedreich ataxia)." },
  { id: "vsc", n: "Ventral spinocerebellar", d: "a", p: "L:cd R:cd R:cm R:mm R:rm R:po E:cb", loc: {},
    o: "Spinal border cells, lumbosacral cord.", c: "Cross, ascend the ventrolateral cord and brainstem, enter via the superior cerebellar peduncle.", x: "Double crossing: in the cord, and again in the cerebellum.", t: "Ipsilateral cerebellar cortex (net uncrossed).", f: "Unconscious feedback of whole-limb motor activity.", l: "Ipsilateral lower-limb ataxia." },
  { id: "cun", n: "Cuneocerebellar", d: "a", p: "L:cd L:mm E:cb", loc: {},
    o: "Accessory (external) cuneate nucleus, relaying upper-limb and neck proprioceptors via the cuneate fasciculus.", c: "External arcuate fibres, then the inferior cerebellar peduncle.", x: "None.", t: "Ipsilateral cerebellar vermis/paravermis.", f: "Upper-limb equivalent of the dorsal spinocerebellar tract.", l: "Ipsilateral arm ataxia." },
  { id: "ml", n: "Medial lemniscus", d: "a", p: "L:mm R:mm R:rm R:po R:mb R:th R:cx", loc: {},
    o: "Nucleus gracilis and cuneatus.", c: "Internal arcuate fibres sweep ventromedially, then ascend by the midline (vertical in medulla, lateral and flat in pons/midbrain), then the internal capsule.", x: "Sensory (lemniscal) decussation in mid medulla.", t: "VPL thalamus, then S1.", f: "Fine touch, vibration, proprioception.", l: "Contralateral loss of vibration/position sense. Medial medullary syndrome: contralateral ML loss + hemiparesis, ipsilateral tongue weakness (anterior spinal artery)." },
  { id: "sl", n: "Spinal lemniscus (spinothalamic in brainstem)", d: "a", p: "L:cs R:cs R:cm R:mm R:rm R:po R:mb R:th R:cx", loc: {},
    o: "Contralateral dorsal horn (spinothalamic, spinoreticular, spinotectal fibres).", c: "Anterolateral medulla, then dorsolateral pons, then lateral midbrain.", x: "Already crossed in the cord.", t: "VPL, intralaminar thalamus, reticular formation, tectum.", f: "Pain, temperature, crude touch.", l: "Lateral medullary (Wallenberg, PICA): contralateral body pain/temperature loss." },
  { id: "tl", n: "Trigeminal lemniscus", d: "a", p: "L:rm R:rm R:po R:mb R:th R:cx", loc: {},
    o: "Spinal trigeminal nucleus (pain/temperature) and principal sensory nucleus (touch) of CN V.", c: "Ventral trigeminothalamic fibres cross and join the medial lemniscus, then ascend dorsomedially.", x: "Crosses in medulla/pons (small dorsal tract is uncrossed).", t: "VPM thalamus, then S1 face area.", f: "Face and oral cavity sensation.", l: "Wallenberg: ipsilateral face pain/temperature loss (spinal V) with contralateral body loss." },
  { id: "ll", n: "Lateral lemniscus", d: "a", p: "L:po R:po R:mb R:th R:cx", loc: {},
    o: "Cochlear nuclei and superior olivary complex (pons).", c: "Via trapezoid body, ascends lateral pontine tegmentum to the inferior colliculus.", x: "Most fibres cross in the trapezoid body; bilateral representation.", t: "Inferior colliculus, then MGB, then auditory cortex (Heschl’s gyrus).", f: "Hearing and sound localisation.", l: "Central unilateral lesions give subtle bilateral hearing and localisation deficits, not unilateral deafness." },
  { id: "cb", n: "Corticobulbar", d: "d", p: "R:cx R:mb R:po R:rm", loc: {},
    o: "Motor and premotor cortex (face area), lateral precentral gyrus.", c: "Corona radiata, genu of internal capsule, medial cerebral peduncle, pons, medulla.", x: "Mostly bilateral, with branches crossing at each cranial nerve nucleus.", t: "Motor nuclei of CN V, VII, IX–XII via reticular formation.", f: "Voluntary control of face, jaw, tongue, pharynx.", l: "UMN facial palsy: contralateral lower face weak, forehead spared. Tongue deviates away from a cortical lesion. Bilateral lesions: pseudobulbar palsy." },
  { id: "lcst", n: "Lateral corticospinal", d: "d", p: "R:cx R:mb R:po R:rm R:cm L:cm L:cd L:cs", loc: {},
    o: "M1 (about 30%), premotor/SMA and S1.", c: "Corona radiata, posterior limb of internal capsule, mid cerebral peduncle, basis pontis, medullary pyramid, lateral funiculus.", x: "Pyramidal decussation in caudal medulla (about 90%).", t: "Lateral ventral horn: α-motor neurons of distal limb muscles.", f: "Voluntary fine, skilled distal movements.", l: "Capsular stroke: contralateral spastic hemiparesis. Spinal lesion: ipsilateral spasticity, hyperreflexia, Babinski below the level." },
  { id: "acst", n: "Anterior corticospinal", d: "d", p: "R:cx R:mb R:po R:rm R:mm R:cm R:cd L:cd", loc: {},
    o: "M1 and premotor cortex (about 10% of fibres).", c: "Same route to the pyramid, then stays uncrossed in the anterior funiculus down to the thoracic cord.", x: "Crosses at the segmental level in the anterior white commissure.", t: "Medial motor neurons for axial and proximal muscles (bilateral).", f: "Posture and axial/trunk movement.", l: "Rarely isolated; bilateral axial weakness." },
  { id: "vst", n: "Vestibulospinal (lateral)", d: "d", p: "L:po L:rm L:mm L:cm L:cd L:cs", loc: {},
    o: "Lateral vestibular (Deiters) nucleus, pons/medulla.", c: "Ipsilateral anterior funiculus to sacral cord.", x: "None.", t: "Medial ventral horn: extensor (antigravity) motor neurons.", f: "Posture and balance; facilitates extensors.", l: "Loss of facilitation: reduced extensor tone. Cerebellar lesions disinhibit it." },
  { id: "prst", n: "Pontine (medial) reticulospinal", d: "d", p: "L:po L:rm L:cm L:cd L:cs", loc: {},
    o: "Pontine reticular formation (nuclei pontis oralis/caudalis).", c: "Ipsilateral medial anterior funiculus.", x: "None (mostly ipsilateral).", t: "Interneurons and motor neurons of axial and proximal extensors.", f: "Excites extensors, anti-gravity posture.", l: "With loss of cortical drive: decerebrate (extensor) posturing." },
  { id: "mrst", n: "Medullary (lateral) reticulospinal", d: "d", p: "L:rm L:mm L:cm L:cd L:cs", loc: {},
    o: "Medullary reticular formation (gigantocellular nucleus).", c: "Bilateral, mainly ipsilateral, ventrolateral funiculus.", x: "Partial, bilateral.", t: "Interneurons inhibiting extensors, facilitating flexors; autonomic and respiratory circuits.", f: "Inhibits extensors, modulates spinal reflexes, gait and autonomic control.", l: "Lesion above the red nucleus (rubrospinal intact): decorticate posture." },
  { id: "rub", n: "Rubrospinal", d: "d", p: "L:mb R:mb R:po R:rm R:mm R:cm R:cd R:cs", loc: {},
    o: "Magnocellular red nucleus, midbrain (receives cortex and cerebellum).", c: "Descends contralaterally through pons and medulla to the lateral funiculus, just ventral to the lateral corticospinal tract.", x: "Ventral tegmental decussation in midbrain.", t: "Cervical interneurons and flexor motor neurons of upper limb.", f: "Flexor tone, upper-limb movement (small in humans).", l: "Lesion above red nucleus: decorticate posture (flexed arms, extended legs)." },
  { id: "ns", n: "Nigrostriatal", d: "a", p: "R:mb R:bg", loc: {},
    o: "Substantia nigra pars compacta (dopaminergic).", c: "Ascends through the lateral hypothalamus/medial forebrain bundle and internal capsule.", x: "None (ipsilateral).", t: "Caudate and putamen (dorsal striatum).", f: "Dopamine: excites direct (D1) and inhibits indirect (D2) pathway, so facilitates movement initiation.", l: "Degeneration: Parkinson disease (bradykinesia, rigidity, rest tremor)." },
  { id: "mlf", n: "Medial longitudinal fasciculus", d: "b", p: "L:rm L:po L:mb", loc: {},
    o: "Vestibular nuclei (plus abducens interneurons, riMLF).", c: "Paired midline tracts under the 4th ventricle, from midbrain to cervical cord; descending part is the medial vestibulospinal tract.", x: "Ascending fibres cross at the vestibular/abducens level.", t: "CN III, IV, VI nuclei; cervical motor neurons.", f: "Links gaze centres so eyes move together, with head-eye reflex (VOR).", l: "Internuclear ophthalmoplegia: ipsilateral adduction failure, contralateral abducting nystagmus (MS)." }
];

const CN = [
  { id: "cn1", n: "CN I Olfactory", d: "n", p: "O:olf L:olf", loc: {} },
  { id: "cn2", n: "CN II Optic", d: "n", p: "O:th L:th R:th", loc: {} },
  { id: "cn3", n: "CN III Oculomotor", d: "n", p: "L:mb O:mb", loc: {} },
  { id: "cn4", n: "CN IV Trochlear", d: "n", p: "R:mb L:mb O:mb", loc: {} },
  { id: "cn5", n: "CN V Trigeminal", d: "n", p: "O:po L:po L:rm L:mm L:cm L:cd", loc: {} },
  { id: "cn6", n: "CN VI Abducens", d: "n", p: "L:po O:po", loc: {} },
  { id: "cn7", n: "CN VII Facial", d: "n", p: "L:po O:po", loc: {} },
  { id: "cn8", n: "CN VIII Vestibulocochlear", d: "n", p: "O:po L:po L:rm", loc: {} },
  { id: "cn9", n: "CN IX Glossopharyngeal", d: "n", p: "O:rm L:rm", loc: {} },
  { id: "cn10", n: "CN X Vagus", d: "n", p: "L:rm L:mm O:mm", loc: {} },
  { id: "cn11", n: "CN XI Accessory", d: "n", p: "L:cd L:cm O:rm", loc: {} },
  { id: "cn12", n: "CN XII Hypoglossal", d: "n", p: "L:rm L:mm O:mm", loc: {} }
];

const CB = [
  { id: "pcb", n: "Pontocerebellar (corticopontocerebellar)", d: "d", p: "R:cx R:mb R:po L:po E:cb", loc: {} },
  { id: "olcb", n: "Olivocerebellar", d: "a", p: "L:rm R:rm E:cb", loc: {} },
  { id: "dtc", n: "Dentatothalamic (cerebellothalamic)", d: "a", p: "E:cb L:po R:mb R:th R:cx", loc: {} }
];

const CX = [
  { id: "crb", n: "Corticorubral", d: "d", p: "R:cx R:mb", loc: { rmb: [[17, 94, 3, 6]] } },
  { id: "tect", n: "Tectospinal", d: "d", p: "L:mb R:mb R:po R:rm R:cm R:cd", loc: { rmb: [[26, 40, 10, 6], [6, 90, 8, 3]], cmb: [[3, 90, 5, 4]], rp: [[8, 96, 4, 5]], cp: [[7, 74, 4, 5]], rm: [[9, 90, 4, 6]], mm: [[8, 94, 4, 6]], cm: [[11, 98, 4, 6]], c: [[24, 156, 4, 6]] } }
];

T.push(...CN, ...CB, ...CX);
T.forEach((t, i) => t.col = `hsl(${(i * 137) % 360} 68% 48%)`);

const TX = {
  dc: ["First-order neurons: large-diameter (Aβ) afferents from mechanoreceptors and muscle/joint receptors, with cell bodies in the dorsal root ganglia. Fasciculus gracilis carries input from below T6 (leg); fasciculus cuneatus from T6 and above (arm).", "Enter through the medial dorsal root, then ascend ipsilaterally in the dorsal funiculus without synapsing (gracilis medial, cuneatus lateral) to the caudal medulla.", "Does not cross in the cord; the second-order fibres cross in the medulla as the internal arcuate fibres.", "Terminates in the nucleus gracilis and nucleus cuneatus (dorsal medulla), where the second-order neurons begin the medial lemniscus.", "Carries fine (discriminative) touch, vibration, two-point discrimination and conscious proprioception.", "Lesion: ipsilateral loss of vibration and position sense below the lesion, with sensory ataxia and a positive Romberg sign. Examples: tabes dorsalis, subacute combined degeneration (B12 deficiency), dorsal column compression."],
  ast: ["Second-order neurons in dorsal horn laminae I and V to VII, receiving Aδ and C afferents (crude touch and pressure).", "Axons cross, then ascend in the anterior funiculus and join the spinal lemniscus in the brainstem.", "Crosses in the anterior white commissure, 1 to 2 segments above the level of entry.", "Terminates in the ventral posterolateral (VPL) nucleus of the thalamus, with collaterals to the reticular formation; third-order neurons project to S1.", "Carries crude touch and pressure.", "Lesion: contralateral mild loss of crude touch beginning a few segments below the lesion; usually masked by the intact dorsal columns."],
  lst: ["Second-order neurons in dorsal horn laminae I and V, receiving Aδ and C afferents (pain and temperature).", "Axons cross, then ascend in the lateral funiculus with somatotopy (sacral fibres lateral, cervical fibres medial) and continue as the spinal lemniscus.", "Crosses in the anterior white commissure, 1 to 2 segments above the level of entry.", "Terminates in the VPL nucleus of the thalamus (and intralaminar nuclei); third-order neurons project to S1, insula and cingulate cortex.", "Carries sharp pain and temperature.", "Lesion: contralateral loss of pain and temperature starting 1 to 2 segments below the lesion. Syringomyelia: bilateral cape-like loss with preserved touch. Brown-Séquard syndrome: contralateral pain/temperature loss with ipsilateral weakness and dorsal column loss."],
  dsc: ["Second-order neurons in Clarke’s nucleus (C8 to L3), receiving muscle spindle and Golgi tendon organ afferents from the leg and trunk.", "Axons ascend in the ipsilateral dorsolateral funiculus, enter the medulla and pass through the inferior cerebellar peduncle.", "Does not cross.", "Terminates in the ipsilateral cerebellar vermis and paravermis (spinocerebellum) as mossy fibres.", "Carries unconscious proprioception (muscle length and tension) for coordination of lower limb and trunk movement.", "Lesion: ipsilateral lower limb ataxia and incoordination. Example: Friedreich ataxia."],
  vsc: ["Second-order neurons (spinal border cells) in the lumbosacral cord, reporting activity of spinal motor circuits and Golgi tendon organ input from the whole limb.", "Axons cross, ascend in the ventrolateral funiculus through the medulla and pons, and enter the cerebellum through the superior cerebellar peduncle.", "Crosses twice: in the cord (anterior white commissure) and again within the cerebellum, so the final projection is ipsilateral.", "Terminates in the ipsilateral cerebellar vermis and paravermis (spinocerebellum).", "Carries unconscious proprioceptive feedback about motor commands acting on the whole lower limb.", "Lesion: ipsilateral lower limb ataxia (in practice indistinguishable from dorsal spinocerebellar damage)."],
  cun: ["Second-order neurons in the accessory (lateral) cuneate nucleus of the medulla, receiving upper limb and neck proprioceptors via the cuneate fasciculus.", "Axons leave as the external arcuate fibres and enter the inferior cerebellar peduncle.", "Does not cross.", "Terminates in the ipsilateral cerebellar vermis and paravermis (spinocerebellum).", "Carries unconscious proprioception from the upper limb and neck (the upper limb equivalent of the dorsal spinocerebellar tract).", "Lesion: ipsilateral upper limb ataxia."],
  ml: ["Second-order neurons in the nucleus gracilis and nucleus cuneatus of the caudal medulla.", "Axons arc ventromedially as the internal arcuate fibres, cross, and ascend as the medial lemniscus: vertical beside the midline in the medulla, flattened in the pons and lateral in the midbrain, then through the posterior limb of the internal capsule. The leg-to-arm somatotopy rotates as it ascends.", "Crosses in the mid medulla as the internal arcuate fibres (sensory decussation).", "Terminates in the VPL nucleus of the thalamus; third-order neurons project to S1.", "Carries fine touch, vibration and conscious proprioception.", "Lesion: contralateral loss of vibration and position sense. Medial medullary syndrome (anterior spinal artery): contralateral lemniscal loss and hemiparesis with ipsilateral tongue weakness."],
  sl: ["Second-order neurons of the spinothalamic, spinoreticular and spinotectal pathways, with cell bodies in the opposite dorsal horn.", "Ascends in the anterolateral medulla, dorsolateral pons and lateral midbrain, lateral to the medial lemniscus (the anterolateral system).", "Already crossed in the spinal cord.", "Terminates in the VPL and intralaminar thalamic nuclei, the reticular formation and the tectum.", "Carries pain, temperature and crude touch from the contralateral body.", "Lesion: contralateral loss of pain and temperature below the face. Lateral medullary (Wallenberg) syndrome: contralateral body deficit with an ipsilateral facial deficit."],
  tl: ["Second-order neurons in the principal sensory nucleus (touch) and spinal nucleus (pain and temperature) of the trigeminal nerve.", "Ventral trigeminothalamic fibres cross and ascend alongside the medial lemniscus; a small dorsal tract from the principal nucleus ascends uncrossed.", "Crosses in the medulla and pons (the dorsal tract stays ipsilateral).", "Terminates in the ventral posteromedial (VPM) nucleus of the thalamus; third-order neurons project to the face area of S1.", "Carries touch, pain and temperature from the face and oral cavity.", "Lesion: contralateral facial sensory loss. Wallenberg syndrome: ipsilateral facial pain/temperature loss (spinal nucleus and tract) with contralateral body loss."],
  ll: ["Second- and third-order neurons of the cochlear nuclei and superior olivary complex, pons.", "Axons cross through the trapezoid body, then ascend in the lateral pontine and midbrain tegmentum to the inferior colliculus.", "Most fibres cross in the trapezoid body; the pathway is bilateral above the cochlear nuclei.", "Terminates in the inferior colliculus, then the medial geniculate nucleus (MGN) and primary auditory cortex (Heschl’s gyrus).", "Carries hearing and the binaural cues for sound localisation.", "Lesion: because the pathway is bilateral, a central unilateral lesion causes subtle bilateral hearing loss and poor localisation, not unilateral deafness (which points to a cochlear or cochlear nerve lesion)."],
  cb: ["Pyramidal neurons of motor and premotor cortex (face area), lateral precentral gyrus.", "Descends through the corona radiata, the genu of the internal capsule and the medial cerebral peduncle, leaving in the pons and medulla to reach cranial nerve nuclei.", "Mostly bilateral, with branches crossing at each motor nucleus (the lower face and tongue are largely contralateral).", "Terminates in the motor nuclei of CN V, VII, IX, X, XI and XII, mostly via the reticular formation.", "Controls voluntary movement of the face, jaw, tongue and pharynx.", "Lesion: UMN facial palsy (contralateral lower face weak, forehead spared); the tongue deviates away from a cortical lesion. Bilateral lesions cause pseudobulbar palsy."],
  lcst: ["Pyramidal neurons (including Betz cells) of M1 (about 30%), premotor cortex/SMA and S1.", "Descends through the corona radiata, posterior limb of the internal capsule, middle cerebral peduncle, basis pontis and medullary pyramid, then the lateral funiculus of the cord.", "Crosses in the pyramidal decussation of the caudal medulla (about 90% of fibres).", "Terminates in the lateral ventral horn, directly on or via interneurons to α-motor neurons of distal limb muscles.", "Controls voluntary, fine skilled movement of the distal limbs.", "Lesion: contralateral spastic weakness above the pyramidal decussation, ipsilateral below it (spinal lesion), with hyperreflexia and an extensor plantar response (Babinski sign)."],
  acst: ["Pyramidal neurons of M1 and premotor cortex (about 10% of corticospinal fibres).", "Same route as far as the pyramid, then descends uncrossed in the anterior funiculus to the cervical and upper thoracic cord.", "Crosses segmentally in the anterior white commissure at its level of termination.", "Terminates in medial ventral horn motor neurons for axial and proximal muscles (bilateral).", "Controls posture and axial (neck and trunk) movement.", "Lesion: rarely isolated; mild axial weakness."],
  vst: ["Lateral vestibular (Deiters) nucleus of the pons and medulla; the medial tract arises from the medial vestibular nucleus.", "Descends ipsilaterally in the anterior funiculus to the lumbosacral cord (the medial tract descends in the MLF to the cervical cord).", "Does not cross.", "Terminates in the medial ventral horn on extensor (antigravity) and neck motor neurons.", "Controls posture and balance by facilitating extensor tone and coordinating head and body position.", "Lesion: reduced extensor tone and impaired balance. A lesion between the red nucleus and the vestibular nuclei leaves it unopposed and causes decerebrate (extensor) posturing."],
  prst: ["Pontine reticular formation (nucleus pontis oralis and caudalis).", "Descends ipsilaterally in the medial (anterior) funiculus.", "Does not cross (predominantly ipsilateral).", "Terminates on interneurons and motor neurons of axial and proximal extensors.", "Controls extensor tone and antigravity posture.", "Lesion: a lesion between the red and vestibular nuclei removes cortical and rubrospinal drive, leaving pontine reticulospinal and vestibulospinal activity unopposed (decerebrate posturing)."],
  mrst: ["Medullary reticular formation (nucleus gigantocellularis).", "Descends bilaterally, mainly ipsilaterally, in the ventrolateral funiculus.", "Does not cross (bilateral, mostly ipsilateral).", "Terminates on interneurons that inhibit extensors and facilitate flexors, and on autonomic and respiratory circuits.", "Controls inhibition of extensor tone and modulates spinal reflexes, gait and autonomic activity.", "Lesion: a lesion above the red nucleus removes cortical drive to it; the intact rubrospinal tract then produces decorticate posturing."],
  rub: ["Magnocellular red nucleus, rostral midbrain (receives cortex via corticorubral fibres and cerebellum via the dentate and interposed nuclei).", "Axons cross immediately, then descend through the pons and medulla and the lateral funiculus of the cord, just ventral to the lateral corticospinal tract.", "Crosses in the ventral tegmental decussation of the midbrain.", "Terminates in cervical interneurons and flexor motor neurons of the upper limb.", "Controls flexor tone and upper limb movement (small in humans).", "Lesion: a lesion above the red nucleus leaves it intact, producing decorticate posturing (flexed arms, extended legs)."],
  ns: ["Dopaminergic neurons of the substantia nigra pars compacta, midbrain.", "Ascends through the region of the cerebral peduncle, the lateral hypothalamus and the internal capsule.", "Does not cross (ipsilateral).", "Terminates in the caudate and putamen (dorsal striatum).", "Mediates dopaminergic modulation of the striatum: excites the direct pathway (D1) and inhibits the indirect pathway (D2), facilitating movement initiation.", "Lesion: degeneration causes Parkinson disease (bradykinesia, rigidity, rest tremor); dopamine loss reduces thalamic drive to motor cortex."],
  mlf: ["Vestibular nuclei (mainly medial), abducens internuclear neurons and the rostral interstitial nucleus of the MLF.", "Paired tracts run beside the midline under the 4th ventricle and cerebral aqueduct, from the rostral midbrain to the upper cervical cord.", "Ascending fibres cross at the level of the vestibular and abducens nuclei.", "Terminates in the oculomotor, trochlear and abducens nuclei (ascending) and cervical motor neurons (descending, medial vestibulospinal tract).", "Mediates conjugate eye movement coordinated with head movement (vestibulo-ocular reflex).", "Lesion: internuclear ophthalmoplegia (INO): ipsilateral adduction failure with contralateral abducting nystagmus and preserved convergence; typical of multiple sclerosis in young adults and brainstem stroke in older adults."],
  cn1: ["Bipolar olfactory receptor neurons of the olfactory epithelium, synapsing in the olfactory bulb (mitral and tufted cells).", "Fila olfactoria cross the cribriform plate to the olfactory bulb; the olfactory tract then divides into striae.", "Does not cross to a thalamic relay; some fibres cross in the anterior commissure.", "Terminates in the piriform cortex, amygdala and entorhinal cortex (bypassing the thalamus).", "Mediates smell (special sensory).", "Lesion: anosmia. Causes: head trauma (shearing at the cribriform plate), frontal tumours, viral infection, Kallmann syndrome."],
  cn2: ["Retinal ganglion cells.", "Optic nerve through the optic canal, then the optic chiasm and optic tract.", "Crosses at the optic chiasm: nasal retinal fibres (temporal visual field) cross.", "Terminates in the lateral geniculate nucleus, then the optic radiation to V1; branches reach the pretectum and superior colliculus.", "Mediates vision and the afferent limb of the pupillary light reflex (special sensory).", "Lesion: monocular vision loss (nerve), bitemporal hemianopia (chiasm), homonymous hemianopia (tract or radiation), relative afferent pupillary defect. Example: optic neuritis in multiple sclerosis."],
  cn3: ["Oculomotor nucleus and Edinger-Westphal nucleus, rostral midbrain (ventral to the aqueduct).", "Fascicles pass through the red nucleus and crus to the interpeduncular fossa, then the cavernous sinus and superior orbital fissure.", "Does not cross, except that the superior rectus subnucleus supplies the contralateral eye; the levator palpebrae subnucleus is a single midline nucleus supplying both lids.", "Terminates on the superior, inferior and medial recti, inferior oblique and levator palpebrae; Edinger-Westphal fibres synapse in the ciliary ganglion for pupil constriction and accommodation.", "Mediates most eye movements, lid elevation, pupil constriction and accommodation (somatic motor and parasympathetic).", "Lesion: ptosis, dilated pupil and an eye turned “down and out”. Compression (posterior communicating aneurysm, uncal herniation) affects the pupil early; diabetic ischaemia spares it. Weber syndrome: ipsilateral CN III palsy with contralateral hemiparesis."],
  cn4: ["Trochlear nucleus, caudal midbrain (inferior colliculus level).", "The only nerve to exit dorsally: fibres wrap dorsally, cross in the anterior medullary velum, then run around the brainstem to the cavernous sinus and superior orbital fissure.", "Crosses completely: each nucleus supplies the contralateral superior oblique.", "Terminates on the superior oblique.", "Mediates intorsion and depression of the adducted eye (somatic motor).", "Lesion: vertical diplopia worse looking down (stairs, reading), with the head tilted away from the lesion. Commonly injured in head trauma."],
  cn5: ["Four nuclei: mesencephalic (proprioception), principal pontine (touch), spinal (pain and temperature) and motor; sensory cell bodies lie in the trigeminal ganglion.", "Exits the lateral mid pons. V1 passes through the superior orbital fissure, V2 the foramen rotundum and V3 the foramen ovale; the spinal tract descends to the upper cervical cord.", "Second-order sensory fibres cross as the trigeminal lemniscus; the motor nucleus receives bilateral cortical input.", "Terminates in the VPM thalamus (face sensation). Motor fibres end on the muscles of mastication, tensor tympani, tensor veli palatini, mylohyoid and the anterior belly of digastric.", "Mediates facial sensation, chewing and the afferent limb of the corneal reflex (mixed).", "Lesion: ipsilateral facial sensory loss and jaw deviation toward the weak side. Trigeminal neuralgia: lancinating V2/V3 pain. Wallenberg syndrome: ipsilateral facial pain/temperature loss."],
  cn6: ["Abducens nucleus, caudal pons (facial colliculus, floor of the 4th ventricle).", "Exits the pontomedullary junction medially, ascends the clivus, runs in the cavernous sinus beside the internal carotid artery, then passes through the superior orbital fissure.", "Does not cross; the nucleus also contains interneurons that cross and ascend in the MLF to the contralateral oculomotor nucleus (conjugate gaze).", "Terminates on the lateral rectus.", "Mediates abduction of the eye (somatic motor).", "Lesion: medial deviation with horizontal diplopia; a false-localising sign with raised intracranial pressure. A nuclear lesion causes ipsilateral gaze palsy, not isolated abduction weakness."],
  cn7: ["Facial motor nucleus (caudal pons), superior salivatory nucleus, solitary nucleus (taste) and spinal nucleus of V (ear sensation).", "Motor fibres loop around the abducens nucleus (internal genu), exit at the cerebellopontine angle with CN VIII, then pass through the internal acoustic meatus, facial canal and stylomastoid foramen.", "Does not cross; upper face neurons receive bilateral cortical input, lower face neurons mainly contralateral input.", "Terminates on the muscles of facial expression, stapedius and posterior digastric; parasympathetic fibres reach the lacrimal, submandibular and sublingual glands; taste arrives from the anterior two-thirds of the tongue.", "Mediates facial movement, tearing, salivation and taste (mixed).", "Lesion: LMN (Bell) palsy: entire ipsilateral face weak, hyperacusis, taste loss, dry eye. A UMN lesion spares the forehead. Pontine lesion with CN VI palsy: Millard-Gubler syndrome."],
  cn8: ["Spiral ganglion to the cochlear nuclei; vestibular ganglion to the vestibular nuclei (pontomedullary junction).", "Internal acoustic meatus, cerebellopontine angle, then entry at the pontomedullary junction.", "Cochlear fibres cross in the trapezoid body; the central auditory pathway is bilateral.", "Terminates in the cochlear nuclei (then superior olive, lateral lemniscus, inferior colliculus, MGN and A1) and the vestibular nuclei (then MLF, vestibulospinal tract and cerebellum).", "Mediates hearing and balance (special sensory).", "Lesion: ipsilateral sensorineural hearing loss, tinnitus, vertigo and nystagmus. Vestibular schwannoma: progressive unilateral hearing loss, then CN V and VII involvement at the cerebellopontine angle."],
  cn9: ["Nucleus ambiguus (stylopharyngeus), inferior salivatory nucleus, solitary nucleus (taste from the posterior third, carotid sinus and body) and spinal nucleus of V (ear).", "Exits the postolivary (posterolateral) sulcus and leaves the skull through the jugular foramen.", "Does not cross; the nucleus ambiguus receives bilateral corticobulbar input.", "Terminates on the stylopharyngeus; parasympathetic fibres reach the parotid gland via the otic ganglion; afferents arrive from the pharynx, posterior tongue and carotid baroreceptors.", "Mediates swallowing, taste, the afferent limb of the gag reflex and baroreception (mixed).", "Lesion: absent gag (afferent limb), dysphagia, glossopharyngeal neuralgia, loss of the carotid sinus reflex. Jugular foramen syndrome with CN X and XI."],
  cn10: ["Nucleus ambiguus (pharynx and larynx), dorsal motor nucleus of X (parasympathetic) and solitary nucleus (visceral afferents).", "Exits the postolivary sulcus with CN IX, leaves through the jugular foramen and descends in the carotid sheath; the left recurrent laryngeal nerve loops under the aortic arch.", "Does not cross; the nucleus ambiguus receives bilateral corticobulbar input.", "Terminates on pharyngeal and laryngeal muscles; parasympathetic fibres reach the heart, lungs and gut to the splenic flexure.", "Mediates palatal movement, swallowing, phonation and parasympathetic control of the viscera (mixed).", "Lesion: hoarseness, dysphagia, nasal speech, uvula pulled away from the lesion, absent gag (efferent limb). Wallenberg syndrome: ipsilateral palatal and vocal cord weakness."],
  cn11: ["Spinal accessory nucleus in the lateral ventral horn, C1 to C5/6.", "Rootlets ascend through the foramen magnum alongside the cord, then exit through the jugular foramen.", "Does not cross; cortical input to trapezius is mainly contralateral and to sternocleidomastoid mainly ipsilateral.", "Terminates on the sternocleidomastoid and trapezius.", "Mediates head rotation (to the opposite side) and shoulder elevation (somatic motor).", "Lesion: ipsilateral shoulder droop and weak shrug (trapezius), weak head turn to the opposite side (sternocleidomastoid). Causes: neck dissection, jugular foramen lesions."],
  cn12: ["Hypoglossal nucleus, medial medulla under the floor of the 4th ventricle.", "Fibres run ventrally between the pyramid and olive (preolivary sulcus) and leave through the hypoglossal canal.", "Does not cross; corticobulbar input is mainly contralateral (to genioglossus).", "Terminates on the intrinsic and extrinsic tongue muscles (except palatoglossus).", "Mediates tongue movement, speech and swallowing (somatic motor).", "Lesion: the tongue deviates toward an LMN lesion (with atrophy and fasciculations) and away from a UMN (cortical) lesion. Medial medullary syndrome: ipsilateral tongue weakness with contralateral hemiparesis and lemniscal loss."],
  pcb: ["Layer V pyramidal neurons of frontal, parietal, temporal and occipital cortex, relayed in the pontine nuclei.", "Corticopontine fibres descend in the internal capsule and crus cerebri (frontopontine medial, parieto-occipito-temporopontine lateral) to the pontine nuclei; transverse pontine fibres then cross and enter the middle cerebellar peduncle.", "Crosses in the basis pontis: each pontine nucleus projects to the contralateral cerebellar hemisphere.", "Terminates in the contralateral cerebellar hemisphere (cerebrocerebellum) as mossy fibres.", "Mediates the transfer of planned cortical movement to the cerebellum, so that timing and coordination can be refined.", "Lesion: cortex to pons and cerebellum to thalamus to cortex each cross, so a cerebellar hemisphere lesion causes ipsilateral limb ataxia, dysmetria, intention tremor and dysdiadochokinesia."],
  olcb: ["Inferior olivary nucleus (receives spinal, red nucleus, cortical and brainstem input).", "Axons cross the midline through the medulla and enter the contralateral inferior cerebellar peduncle (restiform body).", "Crosses in the medulla.", "Terminates in the contralateral cerebellar cortex as climbing fibres on Purkinje cells, with collaterals to the deep nuclei.", "Carries error signals for motor learning and timing.", "Lesion: palatal myoclonus and hypertrophic olivary degeneration (Guillain-Mollaret triangle lesions). Lateral medullary infarct involving the inferior cerebellar peduncle: ipsilateral ataxia."],
  dtc: ["Dentate nucleus (mostly) and the interposed (globose and emboliform) nuclei.", "Leaves through the superior cerebellar peduncle and ascends to the caudal midbrain.", "Crosses in the decussation of the superior cerebellar peduncle, caudal midbrain.", "Terminates in the contralateral red nucleus and VL thalamus; thalamic neurons project to motor and premotor cortex (the interposed nuclei also drive the rubrospinal tract).", "Carries cerebellar output that refines cortical motor commands.", "Lesion: ipsilateral intention tremor, dysmetria and past-pointing. Midbrain lesions of the superior cerebellar peduncle or red nucleus can cause a coarse Holmes (rubral) tremor."],
  crb: ["Pyramidal neurons of motor and premotor cortex (ipsilateral, somatotopic).", "Descends through the corona radiata, internal capsule and cerebral peduncle; fibres leave the crus to enter the rostral midbrain tegmentum.", "Does not cross (ipsilateral).", "Terminates in the red nucleus: the magnocellular part gives the rubrospinal tract, the parvocellular part projects through the central tegmental tract to the inferior olive.", "Controls the cortical influence on the rubrospinal tract (upper limb flexor tone) and feeds the Guillain-Mollaret triangle (red nucleus, inferior olive, dentate).", "Lesion: loss of cortical drive to the rubrospinal system. Guillain-Mollaret triangle lesions cause palatal tremor and hypertrophic olivary degeneration."],
  tect: ["Deep layers of the superior colliculus (rostral midbrain), integrating retinal, frontal eye field and auditory input.", "Fibres arc ventrally around the periaqueductal gray, cross, then descend beside the MLF through the brainstem and in the anterior funiculus of the cervical cord.", "Crosses in the dorsal tegmental decussation of the midbrain.", "Terminates in cervical cord interneurons (C1 to C4, laminae VI to VIII) and brainstem gaze centres.", "Controls reflex turning of the head and neck toward visual and auditory stimuli (orienting reflex).", "Lesion: rarely isolated; superior colliculus damage impairs visual orienting. Dorsal midbrain lesions (pineal tumour, hydrocephalus) cause Parinaud syndrome (upgaze palsy, light-near dissociation) through adjacent structures."]
};

T.forEach(t => {
  const a = TX[t.id];
  if (a) Object.assign(t, { o: a[0], c: a[1], x: a[2], t: a[3], f: a[4], l: a[5] });
});

// Refined cross-section coordinates [dx, y, rx, ry, label]
const R_COORDS = {
  dc: { c: [[7, 50, 6, 12], [22, 52, 9, 11]], cm: [[10, 44, 6, 12], [26, 48, 8, 11]], mm: [[12, 42, 8, 12], [30, 48, 10, 11]] },
  lcst: { c: [[68, 76, 12, 14]], cm: [[14, 122, 11, 16], [56, 88, 9, 12]], mm: [[22, 158, 17, 12]], rm: [[26, 158, 16, 11]], cp: [[24, 140, 13, 9], [46, 146, 10, 8]], rp: [[24, 140, 13, 9], [46, 146, 10, 8]], cmb: [[62, 148, 12, 14]], rmb: [[68, 142, 10, 16]] },
  acst: { c: [[12, 154, 9, 9]], cm: [[6, 150, 6, 8]], cp: [[10, 146, 5, 6]], rp: [[8, 148, 4, 6]] },
  cb: { rm: [[30, 144, 6, 5]], cp: [[16, 130, 5, 5]], rp: [[16, 132, 5, 5]], cmb: [[46, 152, 4, 12]], rmb: [[56, 148, 4, 12]] },
  dsc: { c: [[84, 98, 5, 14]], cm: [[74, 98, 5, 12]], mm: [[72, 104, 5, 10]], rm: [[72, 56, 8, 13]], cp: [[46, 58, 9, 10]] },
  vsc: { c: [[78, 126, 6, 10]], cm: [[72, 124, 5, 10]], mm: [[68, 124, 5, 9]], rm: [[72, 136, 4, 7]], rp: [[30, 46, 5, 9]] },
  cun: { mm: [[42, 68, 7, 7]], rm: [[78, 64, 4, 6]] },
  lst: { c: [[66, 126, 6, 10]] },
  ast: { c: [[44, 152, 6, 7]] },
  sl: { cm: [[60, 126, 7, 10]], mm: [[54, 136, 8, 10]], rm: [[72, 122, 7, 9]], cp: [[50, 98, 6, 8]], rp: [[46, 122, 6, 7]], cmb: [[62, 80, 6, 8]], rmb: [[56, 88, 7, 6]] },
  ml: { mm: [[8, 120, 6, 20], [22, 86, 14, 4]], rm: [[8.5, 114, 6, 24]], cp: [[18, 96, 16, 6]], rp: [[26, 114, 16, 6]], cmb: [[56, 100, 13, 9]], rmb: [[52, 104, 10, 7]] },
  tl: { mm: [[18, 96, 4, 5]], rm: [[22, 100, 5, 6]], cp: [[8, 82, 5, 5]], rp: [[12, 104, 5, 5]], cmb: [[42, 84, 4, 6]], rmb: [[46, 114, 4, 5]] },
  ll: { cp: [[33, 84, 5, 6]], rp: [[40, 108, 5, 6]], cmb: [[58, 58, 5, 8]], rmb: [[62, 64, 8, 10]] },
  mlf: { cm: [[5, 96, 3, 8]], mm: [[4, 80, 3, 9]], rm: [[4, 76, 3, 9]], cp: [[5, 60, 3, 8]], rp: [[4, 82, 3, 8]], cmb: [[7, 82, 3, 5]], rmb: [[7, 80, 3, 6]] },
  vst: { c: [[60, 142, 8, 8]], cm: [[44, 108, 5, 7]], mm: [[44, 110, 5, 7]], rm: [[36, 84, 5, 6]], cp: [[38, 60, 3, 4]] },
  mrst: { c: [[38, 134, 7, 8]], cm: [[34, 112, 6, 8]], mm: [[26, 108, 7, 8]], rm: [[28, 98, 7, 8]] },
  prst: { c: [[26, 142, 5, 8]], cm: [[28, 100, 5, 7]], mm: [[24, 128, 5, 7]], rm: [[34, 112, 5, 7]], cp: [[20, 70, 5, 8]], rp: [[16, 92, 6, 8]] },
  rub: { c: [[74, 110, 7, 9]], cm: [[64, 106, 6, 7]], mm: [[50, 96, 5, 7]], rm: [[62, 104, 5, 7]], cp: [[38, 100, 4, 5]], rp: [[52, 100, 5, 6]], cmb: [[34, 132, 10, 5]], rmb: [[30, 106, 12, 12], [8, 146, 12, 4]] },
  olcb: { rm: [[46, 132, 15, 13]] },
  dtc: { rp: [[30, 46, 5, 9]], cmb: [[10, 106, 22, 10]], rmb: [[12, 108, 4, 10]] },
  pcb: { cp: [[30, 122, 26, 3], [30, 168, 28, 3], [66, 114, 10, 18]], rp: [[30, 150, 24, 3], [32, 166, 26, 3], [66, 114, 10, 18]], cmb: [[30, 156, 6, 12], [80, 140, 5, 12]], rmb: [[84, 134, 4, 12], [54, 162, 5, 8]] },
  ns: { cmb: [[46, 134, 14, 7]], rmb: [[42, 136, 14, 7]] },
  cn3: { rmb: [[5, 73, 5, 5], [3.5, 65, 3, 3.5], [7, 128, 3, 18]] },
  cn4: { cmb: [[5, 72, 4.5, 4.5]] },
  cn5: {
    c: [[64, 46, 6, 7, "Spinal tract & nucleus of CN V"]],
    cm: [[58, 66, 9, 12, "Spinal nucleus of CN V"]],
    mm: [[58, 66, 9, 12, "Spinal nucleus of CN V"]],
    rm: [[58, 78, 8.5, 11, "Spinal nucleus of CN V"]],
    cp: [[48, 74, 7, 7.5, "Spinal nucleus of CN V"]],
    rp: [[44, 72, 6, 6.5, "Principal sensory nucleus of CN V"], [32, 72, 5.5, 5.5, "Motor nucleus of CN V"]],
    cmb: [[14, 56, 3, 7, "Mesencephalic nucleus of CN V"]],
    rmb: [[14, 54, 3, 6, "Mesencephalic nucleus of CN V"]]
  },
  cn6: { cp: [[11, 58, 5.5, 5.5], [13, 108, 2.8, 22]] },
  cn7: { cp: [[32, 82, 7, 7], [12, 51, 5, 3.5]] },
  cn8: { cp: [[24, 54, 5.5, 5], [35, 54, 5.5, 5], [58, 52, 5, 6]], rm: [[28, 52, 6, 5.5], [40, 54, 6, 5.5]] },
  cn9: { cm: [[25, 70, 5, 5]], mm: [[25, 66, 5, 5.5]], rm: [[27, 62, 5, 5], [20, 60, 4, 4], [44, 98, 5.5, 5.5]] },
  cn10: { cm: [[16, 70, 5, 5]], mm: [[15, 64, 5, 5], [42, 98, 5.5, 5.5]], rm: [[16, 58, 5, 5], [44, 98, 5.5, 5.5]] },
  cn11: { c: [[34, 134, 6, 6]] },
  cn12: { cm: [[7, 72, 4.5, 5]], mm: [[6, 64, 4.5, 5]], rm: [[6, 59, 4.5, 5], [17, 114, 2.5, 24]] }
};
T.forEach(t => Object.assign(t.loc, R_COORDS[t.id] || {}));

const LB = {
  cn3: { rmb: ["Oculomotor nucleus", "Edinger-Westphal nucleus", "Oculomotor nerve fascicles"] },
  cn4: { cmb: ["Trochlear nucleus"] },
  cn6: { cp: ["Abducens nucleus", "Abducens nerve fascicles"] },
  cn7: { cp: ["Facial motor nucleus", "Facial colliculus (internal genu)"] },
  cn8: { cp: ["Medial vestibular nucleus", "Lateral vestibular nucleus", "Cochlear nuclei"], rm: ["Medial vestibular nucleus", "Inferior vestibular nucleus"] },
  cn9: { cm: ["Nucleus tractus solitarius"], mm: ["Nucleus tractus solitarius"], rm: ["Nucleus tractus solitarius", "Inferior salivatory nucleus", "Nucleus ambiguus"] },
  cn10: { cm: ["Dorsal motor nucleus of vagus"], mm: ["Dorsal motor nucleus of vagus", "Nucleus ambiguus"], rm: ["Dorsal motor nucleus of vagus", "Nucleus ambiguus"] },
  cn11: { c: ["Spinal accessory nucleus (ventral horn)"] },
  cn12: { cm: ["Hypoglossal nucleus"], mm: ["Hypoglossal nucleus"], rm: ["Hypoglossal nucleus", "Hypoglossal nerve rootlets"] },
  dc: { c: ["Fasciculus gracilis", "Fasciculus cuneatus"], cm: ["Fasciculus gracilis", "Fasciculus cuneatus"], mm: ["Nucleus gracilis", "Nucleus cuneatus"] },
  ml: { mm: ["Medial lemniscus", "Internal arcuate fibres"] },
  cun: { mm: ["Accessory cuneate nucleus"] },
  dsc: { cp: ["Inferior cerebellar peduncle"], rm: ["Inferior cerebellar peduncle"] },
  olcb: { rm: ["Inferior olivary nucleus"] },
  lcst: { cm: ["Pyramidal decussation", "Lateral corticospinal tract"], mm: ["Pyramid"], rm: ["Pyramid"] },
  mrst: { cm: ["Medullary reticular formation"], mm: ["Medullary reticular formation"], rm: ["Medullary reticular formation"] },
  prst: { cp: ["Pontine reticular formation"], rp: ["Pontine reticular formation"] },
  pcb: { cp: ["Transverse pontine fibres", "Transverse pontine fibres", "Middle cerebellar peduncle"], rp: ["Transverse pontine fibres", "Transverse pontine fibres", "Middle cerebellar peduncle"], cmb: ["Frontopontine fibres", "Parieto-occipito-temporopontine"], rmb: ["Parieto-occipito-temporopontine", "Frontopontine fibres"] },
  rub: { cmb: ["Rubrospinal fibres"], rmb: ["Red nucleus", "Ventral tegmental decussation"] },
  dtc: { rp: ["Superior cerebellar peduncle"], cmb: ["Decussation of the SCP"], rmb: ["Dentato-rubro-thalamic fibres"] },
  ns: { cmb: ["Substantia nigra"], rmb: ["Substantia nigra"] },
  tect: { rmb: ["Superior colliculus", "Dorsal tegmental decussation"] },
  ll: { rmb: ["Brachium of inferior colliculus (to MGN)"] }
};
for (const id in LB) {
  const t = T.find(x => x.id == id);
  for (const lv in LB[id]) {
    LB[id][lv].forEach((n, i) => {
      if (t.loc[lv] && t.loc[lv][i]) t.loc[lv][i][4] = n;
    });
  }
}

const ST = {
  PFC: ["Prefrontal cortex", "Executive function, planning, working memory. Frontopontine fibres run in the medial cerebral peduncle. Main thalamic partner: MD."],
  BRO: ["Broca area (BA 44/45)", "Dominant inferior frontal gyrus: speech production. Lesion: non-fluent aphasia with preserved comprehension."],
  PM: ["Premotor / supplementary motor cortex", "Plans and sequences movement; contributes corticospinal fibres; driven by VL thalamus."],
  M1: ["Primary motor cortex (M1, BA 4)", "Precentral gyrus with motor homunculus; Betz cells. Origin of corticospinal and corticobulbar fibres. Lesion: contralateral spastic weakness."],
  S1: ["Primary somatosensory cortex (S1, BA 3,1,2)", "Postcentral gyrus; receives VPL (body) and VPM (face) through the posterior limb of the internal capsule. Lesion: contralateral loss of discriminative touch."],
  PAR: ["Parietal association cortex", "Integrates somatosensory and visual space. Lesions: contralateral neglect (non-dominant), apraxia, agnosia."],
  V1: ["Primary visual cortex (BA 17)", "Calcarine cortex; receives the LGN optic radiation."],
  A1: ["Primary auditory cortex (BA 41/42)", "Heschl gyrus, tonotopic. Receives MGN; input is bilateral, so unilateral lesions rarely cause deafness."],
  WER: ["Wernicke area (BA 22)", "Dominant posterior superior temporal gyrus: comprehension. Lesion: fluent aphasia with poor comprehension."],
  OLF: ["Primary olfactory (piriform) cortex", "Medial temporal lobe; receives the lateral olfactory tract directly, the only sense that bypasses the thalamus."],
  ANT: ["Anterior nucleus of thalamus", "Limbic relay (mammillothalamic tract to cingulate cortex, Papez circuit); memory."],
  VA: ["Ventral anterior nucleus (VA)", "Receives GPi/SNr; projects to premotor and prefrontal cortex: motor planning loop."],
  VL: ["Ventral lateral nucleus (VL)", "Receives cerebellum (dentate) and GPi; projects to M1 and premotor cortex. Target in tremor surgery."],
  MD: ["Mediodorsal nucleus (MD)", "Reciprocal with prefrontal cortex and limbic system: emotion, executive function. Damaged in Korsakoff syndrome."],
  IL: ["Intralaminar nuclei (CM/Pf)", "Arousal; receive reticular formation and spinothalamic collaterals; project diffusely and to striatum."],
  VPL: ["Ventral posterolateral nucleus (VPL)", "Body sensory relay: medial lemniscus (touch, proprioception) and spinal lemniscus (pain, temperature) to S1."],
  VPM: ["Ventral posteromedial nucleus (VPM)", "Face sensory relay: trigeminal lemniscus; also taste. Projects to S1 face area."],
  PUL: ["Pulvinar", "Visual attention and association; connects with parietal and temporal association cortex."],
  LGN: ["Lateral geniculate nucleus (LGN)", "Visual relay from optic tract to V1."],
  MGN: ["Medial geniculate nucleus (MGN)", "Auditory relay: inferior colliculus (brachium) to A1; receives the lateral lemniscus pathway."],
  CAU: ["Caudate nucleus", "Striatum, cognitive loops; receives nigrostriatal dopamine. Atrophy in Huntington disease."],
  PUT: ["Putamen", "Striatum, motor loop; receives cortex and SNc dopamine. Dopamine loss causes Parkinson disease."],
  GPE: ["Globus pallidus externus (GPe)", "Indirect pathway: inhibited by striatum (D2), inhibits STN."],
  GPI: ["Globus pallidus internus (GPi)", "Main output nucleus: inhibits VA/VL. The direct pathway reduces this inhibition, releasing movement. DBS target."],
  STN: ["Subthalamic nucleus (STN)", "Excitatory drive to GPi. Lesion: contralateral hemiballismus."],
  SN: ["Substantia nigra", "Pars compacta: dopaminergic neurons of the nigrostriatal tract. Pars reticulata: GABAergic output. Loss: Parkinson disease."],
  ANTL: ["Anterior lobe (spinocerebellum)", "Receives dorsal and ventral spinocerebellar and cuneocerebellar input. Regulates tone and ongoing limb movement. Vermal damage (alcohol, midline tumours): truncal and gait ataxia."],
  VERM: ["Vermis and paravermis (spinocerebellum)", "Vermis: trunk, posture and gait, projects to the fastigial nucleus. Paravermis: limb movement, projects to the interposed nuclei (globose, emboliform)."],
  HEM: ["Cerebellar hemispheres (cerebrocerebellum)", "Lateral zones receive cortex via pontine nuclei and the MCP, and project to the dentate nucleus. Plan and time voluntary movement. Lesion: ipsilateral limb dysmetria, intention tremor, dysdiadochokinesia."],
  FN: ["Flocculonodular lobe (vestibulocerebellum)", "Receives vestibular input, projects to vestibular nuclei and fastigial nucleus. Balance and eye movements. Lesion: truncal ataxia, nystagmus, vertigo."],
  FAS: ["Fastigial nucleus", "Receives the vermis; projects to vestibular nuclei and reticular formation (vestibulospinal and reticulospinal tracts). Axial and proximal control."],
  GLO: ["Globose nucleus", "Interposed nucleus with emboliform; paravermal input; projects to the contralateral red nucleus for limb tone."],
  EMB: ["Emboliform nucleus", "Interposed nucleus; paravermal input; projects to the contralateral red nucleus (and VL)."],
  DEN: ["Dentate nucleus", "Largest deep cerebellar nucleus (crumpled serrated ribbon); receives the lateral hemisphere. Output leaves via the SCP, crosses in the caudal midbrain, and reaches the contralateral red nucleus and VL thalamus."],
  MCP: ["Middle cerebellar peduncle (MCP)", "Entirely afferent: crossed pontocerebellar fibres from the pontine nuclei. The largest peduncle."],
  ICP: ["Inferior cerebellar peduncle (ICP)", "Restiform body: dorsal spinocerebellar, cuneocerebellar, olivocerebellar and vestibular afferents. Juxtarestiform body: efferents to the vestibular nuclei."],
  SCP: ["Superior cerebellar peduncle (SCP)", "Main output (dentate and interposed nuclei) decussating in the caudal midbrain; also carries ventral spinocerebellar input. Lesion: ipsilateral intention tremor and ataxia."]
};

const TG = {
  ml: ["VPL", "S1"], sl: ["VPL", "IL", "S1"], lst: ["VPL", "S1"], ast: ["VPL", "S1"], tl: ["VPM", "S1"], ll: ["MGN", "A1"],
  ns: ["SN", "CAU", "PUT"], cn1: ["OLF"], dsc: ["ANTL", "VERM", "ICP"], cun: ["VERM", "ICP"], vsc: ["ANTL", "VERM", "SCP"],
  pcb: ["MCP", "HEM", "M1", "PAR", "PFC"], olcb: ["ICP", "HEM", "VERM", "FN"], dtc: ["DEN", "EMB", "SCP", "VL", "M1"],
  crb: ["M1", "PM"], vst: ["FN", "FAS"], cn2: ["LGN", "V1"], cn5: ["VPM", "S1"], cn8: ["MGN", "A1"], cb: ["M1"], lcst: ["M1", "PM"], acst: ["M1", "PM"]
};

const M = a => a.flatMap(e => [e, [e[0], 400 - e[1], e[2], e[3], e[4]]]);

// Mapped directly to the real Allen Human Reference Atlas & ICBM152 slice coordinates!
const FB = {
  cx: [
    ["PFC", 92, 74, 28, 26],
    ["BRO", 112, 110, 15, 11],
    ["PM", 148, 54, 15, 22],
    ["M1", 179, 62, 11, 32],
    ["S1", 210, 62, 11, 32],
    ["PAR", 268, 66, 28, 24],
    ["V1", 336, 122, 18, 22],
    ["A1", 216, 114, 15, 9],
    ["WER", 252, 120, 18, 11],
    ["OLF", 136, 162, 16, 7]
  ],
  th: [
    // Left Hemisphere on Coronal ICBM152 Slice: Basal Ganglia & Striatum
    ["CAU", 162, 114, 12, 14],
    ["PUT", 121, 143, 13, 21],
    ["GPE", 137, 148, 8, 13],
    ["GPI", 146, 155, 7, 9],
    ["STN", 170, 166, 9, 6],
    ["SN", 172, 178, 13, 7],
    // Right Hemisphere on Coronal ICBM152 Slice: Thalamic Nuclei
    ["ANT", 212, 118, 8, 8],
    ["VA", 228, 120, 10, 8],
    ["VL", 242, 129, 12, 14],
    ["MD", 215, 134, 11, 12],
    ["IL", 224, 145, 7, 6],
    ["VPL", 248, 144, 13, 11],
    ["VPM", 234, 148, 9, 8],
    ["PUL", 254, 136, 14, 12],
    ["LGN", 264, 164, 9, 6],
    ["MGN", 246, 162, 8, 6]
  ],
  cbl: [
    ...M([
      ["HEM", 92, 106, 44, 38],
      ["DEN", 154, 82, 14, 13],
      ["EMB", 172, 82, 5, 6],
      ["GLO", 181, 84, 5, 5],
      ["FAS", 191, 84, 5, 5],
      ["MCP", 140, 34, 13, 15],
      ["ICP", 164, 46, 9, 10],
      ["SCP", 178, 56, 7, 9],
      ["FN", 138, 158, 14, 8]
    ]),
    ["ANTL", 200, 48, 26, 18],
    ["VERM", 200, 106, 12, 42],
    ["FN", 200, 162, 16, 9]
  ]
};

// Embedded real slice image helper (automatically switches between _weigert.png, _mri.png, _lfb.png)
function sliceImgTag(lv, w = 200, h = 200) {
  const modeFile = currentMode === "vector" ? "weigert" : currentMode;
  return `<image class="slice-img" data-lv="${lv}" href="assets/slices/${lv}_${modeFile}.png" x="0" y="0" width="${w}" height="${h}" preserveAspectRatio="none"/>`;
}

const spinalGrayHalf = `<path class="g" d="M100,92 C92,92 84,84 78,66 C74,52 68,43 60,40 C55,39 51,43 53,49 C57,61 61,74 64,87 C60,92 55,96 52,101 C55,105 59,108 62,112 C52,122 45,134 46,145 C48,153 58,155 70,149 C80,143 86,130 88,114 C92,108 96,106 100,106 Z"/>`;
const oliveCrumpleLeft = `<path class="g" d="M70,126 C67,121 63,124 59,120 C55,116 51,121 46,119 C41,117 39,123 35,125 C31,127 34,132 32,136 C30,140 36,143 37,147 C38,151 44,149 48,152 C52,155 56,150 61,152 C66,154 68,148 72,147 C74,145 71,142 67,143 C63,145 59,149 55,147 C51,145 47,149 43,146 C39,143 42,139 39,136 C36,133 41,129 43,126 C45,123 50,126 54,124 C58,122 62,126 67,128 Z" stroke="var(--gm-dark)" stroke-width="0.8"/>`;

const base = {
  c: () => `${sliceImgTag("c", 200, 200)}
    <path class="w" d="M99,36 C82,34 56,38 34,54 C14,68 6,84 8,102 C10,124 22,144 44,156 C64,166 84,166 97,160 L98,136 L100,136 L102,160 C116,166 136,166 156,156 C178,144 190,124 192,102 C194,84 186,68 166,54 C144,38 118,34 101,36 L100,58 Z"/>
    <g>${spinalGrayHalf}</g>
    <g transform="translate(200,0) scale(-1,1)">${spinalGrayHalf}</g>
    <circle class="v" cx="100" cy="99" r="2.8"/>
    <text class="lb" x="100" y="29">Dorsal median sulcus</text>
    <text class="lb" x="100" y="175">Anterior median fissure</text>`,

  cm: () => `${sliceImgTag("cm", 200, 200)}
    <path class="w" d="M99,32 C80,30 56,36 38,52 C22,68 18,90 22,112 C26,136 42,156 64,164 C78,169 92,168 98,162 L100,148 L102,162 C108,168 122,169 136,164 C158,156 174,136 178,112 C182,90 178,68 162,52 C144,36 120,30 101,32 L100,52 Z"/>
    <path class="g" d="M100,66 C86,66 74,72 70,84 C68,94 78,104 100,104 C122,104 132,94 130,84 C126,72 114,66 100,66 Z"/>
    <circle class="v" cx="100" cy="82" r="2.6"/>`,

  mm: () => `${sliceImgTag("mm", 200, 200)}
    <path class="w" d="M99,28 C82,25 62,30 44,44 C26,58 18,78 22,102 C25,122 34,138 48,150 C60,162 76,174 96,174 L100,158 L104,174 C124,174 140,162 152,150 C166,138 175,122 178,102 C182,78 174,58 156,44 C138,30 118,25 101,28 L100,48 Z"/>
    <ellipse class="g-ret" cx="100" cy="102" rx="48" ry="34"/>
    <g transform="translate(4,10) scale(0.92)">${oliveCrumpleLeft}</g>
    <g transform="translate(196,10) scale(-0.92,0.92)">${oliveCrumpleLeft}</g>
    <circle class="v" cx="100" cy="60" r="2.6"/>`,

  rm: () => `${sliceImgTag("rm", 200, 200)}
    <path class="w" d="M58,36 C40,34 22,48 18,72 C14,98 22,126 36,146 C48,160 66,174 96,174 L100,154 L104,174 C134,174 152,160 164,146 C178,126 186,98 182,72 C178,48 160,34 142,36 L124,48 C114,54 106,56 100,58 C94,56 86,54 76,48 Z"/>
    <path class="v" d="M58,36 Q100,26 142,36 L124,48 C114,54 106,56 100,58 C94,56 86,54 76,48 Z"/>
    ${oliveCrumpleLeft}
    <g transform="translate(200,0) scale(-1,1)">${oliveCrumpleLeft}</g>
    <text class="lb" x="54" y="135">Inf. olive</text>
    <text class="lb" x="146" y="135">Inf. olive</text>
    <text class="lb" x="100" y="24">4th ventricle (open medulla)</text>`,

  cp: () => `${sliceImgTag("cp", 200, 200)}
    <path class="w" d="M56,36 C36,42 18,64 16,92 C14,116 20,146 44,166 C64,180 86,180 100,178 C114,180 136,180 156,166 C180,146 186,116 184,92 C182,64 164,42 144,36 L124,46 C114,50 106,48 100,50 C94,48 86,50 76,46 Z"/>
    <path class="v" d="M68,36 Q100,28 132,36 L122,48 C112,52 106,48 100,50 C94,48 88,52 78,48 Z"/>
    <text class="lb" x="100" y="158">Basis pontis (pontine nuclei)</text>
    <text class="lb" x="100" y="24">4th ventricle</text>`,

  rp: () => `${sliceImgTag("rp", 200, 200)}
    <path class="w" d="M64,32 C42,40 20,64 18,96 C14,124 22,154 46,170 C66,182 88,182 100,180 C112,182 134,182 154,170 C178,154 186,124 182,96 C180,64 158,40 136,32 L120,42 C110,36 90,36 80,42 Z"/>
    <path class="v" d="M76,38 C88,32 112,32 124,38 L118,56 C108,62 92,62 82,56 Z"/>
    <text class="lb" x="100" y="156">Basis pontis</text>
    <text class="lb" x="100" y="49">4th ventricle</text>`,

  cmb: () => `${sliceImgTag("cmb", 200, 200)}
    <path class="w" d="M58,36 C68,24 84,26 96,34 L100,36 L104,34 C116,26 132,24 142,36 C164,46 180,68 178,96 C184,126 174,160 150,174 C134,182 118,174 110,158 C106,150 94,150 90,158 C82,174 66,182 50,174 C26,160 16,126 22,96 C20,68 36,46 58,36 Z"/>
    <ellipse class="g" cx="68" cy="46" rx="18" ry="13"/>
    <ellipse class="g" cx="132" cy="46" rx="18" ry="13"/>
    <circle class="v" cx="100" cy="56" r="4.2"/>
    <text class="lb" x="68" y="48">Inf. colliculus</text>
    <text class="lb" x="132" y="48">Inf. colliculus</text>
    <text class="lb" x="100" y="168">Interpeduncular fossa</text>`,

  rmb: () => `${sliceImgTag("rmb", 200, 200)}
    <path class="w" d="M62,32 C74,22 90,24 98,32 L100,34 L102,32 C110,24 126,22 138,32 C160,40 178,64 176,94 C182,126 172,160 148,174 C132,182 116,170 108,154 C104,146 96,146 92,154 C84,170 68,182 52,174 C28,160 18,126 24,94 C22,64 40,40 62,32 Z"/>
    <ellipse class="g" cx="74" cy="38" rx="20" ry="9"/>
    <ellipse class="g" cx="126" cy="38" rx="20" ry="9"/>
    <circle class="v" cx="100" cy="56" r="4"/>
    <text class="lb" x="38" y="66">MGN</text>
    <text class="lb" x="162" y="66">MGN</text>
    <text class="lb" x="100" y="22">Sup. colliculi</text>`,

  cx: () => `${sliceImgTag("cx", 400, 200)}
    <path class="w" d="M22,118 C12,76 48,28 114,14 C172,4 252,4 312,24 C368,44 390,88 380,126 C368,156 332,168 292,158 L262,178 C236,188 206,174 186,158 C148,164 112,160 88,144 C56,144 30,136 22,118 Z"/>
    <path class="sulcus" d="M195,12 C190,46 196,76 190,110 M112,118 C158,114 204,106 258,94 M62,146 L120,160"/>
    <circle class="g" cx="62" cy="146" r="3.5"/>
    <text class="lb" x="82" y="156">Olfactory bulb &amp; tract (CN I)</text>
    <text class="lb" x="200" y="11">Frontal pole (Anterior) ← Central sulcus → Occipital pole (Posterior)</text>`,

  th: () => `${sliceImgTag("th", 400, 200)}
    <path class="w" d="M16,102 C16,44 64,8 198,8 C332,8 384,44 384,102 C384,158 340,192 200,192 C60,192 16,158 16,102 Z"/>
    <text class="lb" x="130" y="194">Left Hemisphere: Basal Ganglia &amp; Internal Capsule</text>
    <text class="lb" x="275" y="194">Right Hemisphere: Thalamic Nuclei</text>`,

  cbl: () => `${sliceImgTag("cbl", 400, 200)}
    <ellipse class="w" cx="200" cy="104" rx="176" ry="86"/>
    <text class="lb" x="200" y="12">Horizontal section through Cerebellar Hemispheres, Vermis, Dentate Nucleus &amp; Peduncles</text>`
};

// Custom anatomical SVG <path> shapes for key tracts/nuclei
const CUSTOM_SHAPES = {
  c: {
    "dc:0": "M101,37 C106,37 111,38 114,40 L111,64 C107,65 104,64 101,62 Z",
    "dc:1": "M115,40 C124,42 133,46 139,52 L127,70 C121,67 116,65 112,64 Z",
    "lcst:0": "M154,66 C166,64 178,70 179,82 C180,93 169,98 156,94 C147,91 144,74 154,66 Z",
    "dsc:0": "M180,78 C186,84 189,96 187,110 L180,108 C181,96 179,86 175,80 Z",
    "vsc:0": "M185,112 C183,124 177,135 169,142 L164,136 C171,129 176,120 178,110 Z",
    "lst:0": "M156,116 C165,114 173,120 172,130 C170,138 160,141 153,136 C147,131 149,118 156,116 Z"
  },
  cm: {
    "dc:0": "M102,33 C107,33 112,35 115,38 L111,54 C107,54 104,53 102,51 Z",
    "dc:1": "M116,38 C124,40 132,45 136,52 L124,60 C119,56 115,54 112,54 Z",
    "lcst:0": "M103,110 C114,108 124,118 123,132 C122,142 111,146 103,138 Z"
  },
  mm: {
    "lcst:0": "M104,146 C118,144 136,150 140,160 C142,168 126,172 106,170 Z",
    "ml:0": "M102,100 C108,98 114,104 114,120 C114,136 108,142 102,140 Z"
  },
  rm: {
    "lcst:0": "M104,146 C118,144 136,150 140,160 C142,168 126,172 106,170 Z",
    "ml:0": "M102,90 C108,88 114,96 114,114 C114,132 108,138 102,136 Z",
    "olcb:0": "M126,122 C134,116 146,114 156,118 C164,122 168,130 165,138 C162,144 166,148 160,152 C152,156 140,154 132,148 C126,144 126,138 134,140 C142,142 154,144 158,138 C161,132 155,124 146,124 C138,124 132,128 127,126 Z"
  },
  cp: {
    "ml:0": "M103,90 C114,86 130,88 134,96 C136,103 120,105 103,102 Z"
  },
  rp: {
    "ml:0": "M110,108 C122,106 138,108 142,115 C140,121 122,122 110,118 Z"
  },
  cmb: {
    "ml:0": "M142,96 C152,88 166,90 170,98 C168,108 152,110 142,104 Z",
    "ns:0": "M118,122 C136,126 154,134 166,144 L160,152 C146,142 128,134 114,130 Z"
  },
  rmb: {
    "rub:0": "M130,94 A12,12 0 1,1 129.9,94 Z",
    "ns:0": "M118,124 C136,128 154,136 166,146 L160,154 C146,144 128,136 114,132 Z"
  }
};

// Decussation Crossing Trajectories per Cross-Section Slice
const DEC_PATHS = {
  c: [
    { id: "lst", name: "Anterior white commissure (pain/temp decussation)", d: "M42,96 C68,106 88,109 100,109 C112,109 138,124 166,126", mx: 100, my: 112 },
    { id: "ast", name: "Anterior white commissure (crude touch decussation)", d: "M44,100 C70,110 88,112 100,112 C114,112 128,138 144,152", mx: 100, my: 115 },
    { id: "vsc", name: "Anterior white commissure (ventral spinocerebellar)", d: "M56,104 C76,112 90,113 100,113 C116,113 152,126 178,126", mx: 100, my: 114 },
    { id: "acst", name: "Anterior white commissure (segmental motor decussation)", d: "M112,154 C106,134 102,114 100,112 C94,112 76,126 60,140", mx: 100, my: 120 }
  ],
  cm: [
    { id: "lcst", name: "Pyramidal decussation (motor crossing ~90%)", d: "M114,132 C108,120 96,106 78,96 C62,88 52,86 44,88 M86,132 C92,120 104,106 122,96", mx: 100, my: 114 }
  ],
  mm: [
    { id: "ml", name: "Sensory decussation (internal arcuate fibres)", d: "M88,44 C70,66 76,96 100,108 C105,112 108,118 108,124 M70,48 C56,72 72,102 100,112", mx: 100, my: 108 },
    { id: "dc", name: "Internal arcuate fibres (2nd-order decussation)", d: "M88,44 C70,66 76,96 100,108 C105,112 108,118 108,124", mx: 100, my: 108 }
  ],
  rm: [
    { id: "olcb", name: "Olivocerebellar decussation (to contralateral ICP)", d: "M66,132 C84,126 94,118 100,112 C116,96 148,76 172,56", mx: 100, my: 112 },
    { id: "tl", name: "Ventral trigeminothalamic decussation", d: "M36,84 C64,94 84,100 100,100 C110,100 118,100 122,100", mx: 100, my: 100 }
  ],
  cp: [
    { id: "ll", name: "Trapezoid body (auditory decussation)", d: "M57,42 C72,72 86,86 100,88 C114,88 124,86 133,84", mx: 100, my: 88 },
    { id: "cn8", name: "Trapezoid body (cochlear crossing)", d: "M57,42 C72,72 86,86 100,88 C114,88 124,86 133,84", mx: 100, my: 88 },
    { id: "pcb", name: "Transverse pontine fibres (crossing to MCP)", d: "M126,138 C110,136 90,136 68,128 C52,122 42,116 38,112 M126,162 C104,162 76,154 40,120", mx: 100, my: 146 }
  ],
  rp: [
    { id: "pcb", name: "Transverse pontine fibres (crossing to MCP)", d: "M124,148 C104,148 78,142 52,128 C40,122 34,118 32,118", mx: 100, my: 146 }
  ],
  cmb: [
    { id: "dtc", name: "Decussation of Superior Cerebellar Peduncle (Wernekinck)", d: "M82,112 C92,106 108,106 118,112 M84,100 C94,106 106,106 116,100", mx: 100, my: 106 },
    { id: "cn4", name: "Trochlear nerve decussation (dorsal exit in velum)", d: "M95,76 C92,54 96,34 100,32 C106,30 116,28 126,34", mx: 100, my: 32 }
  ],
  rmb: [
    { id: "rub", name: "Ventral tegmental decussation (Forel)", d: "M70,106 C84,126 94,144 100,146 C106,148 112,148 116,148", mx: 100, my: 144 },
    { id: "tect", name: "Dorsal tegmental decussation (Meynert)", d: "M74,40 C80,64 90,84 100,88 C104,90 106,90 108,90", mx: 100, my: 88 }
  ]
};

const SEC_TO_LONG = {
  cx: ["cx", "olf"], th: ["th", "bg"], rmb: ["mb"], cmb: ["mb"], rp: ["po"], cp: ["po"],
  cbl: ["cb"], rm: ["rm"], mm: ["mm"], cm: ["cm"], c: ["cd", "cs"]
};

function getActiveSidesForSlice(tract, sliceKey) {
  if (!tract || !tract.p) return { L: true, R: true };
  const longKeys = SEC_TO_LONG[sliceKey] || [sliceKey];
  let hasL = false, hasR = false;
  tract.p.split(/\s+|\|/).forEach(tok => {
    const [side, lv] = tok.split(":");
    if (longKeys.includes(lv)) {
      if (side === "L" || side === "O" || side === "E") hasL = true;
      if (side === "R") hasR = true;
    }
  });
  if (!hasL && !hasR) return { L: true, R: true };
  return { L: hasL, R: hasR };
}

const G = [["Ascending", "a"], ["Descending", "d"], ["Both", "b"], ["Cranial nerves", "n"]];
const AR = { a: "▲", d: "▼", b: "⇅", n: "◆" };
const LN = {
  a: "Ascending sensory pathway",
  d: "Descending motor pathway",
  b: "Bidirectional pathway",
  n: "Cranial nerve (nuclei & fascicles)"
};

const SEC = [
  ["cx", "Cerebral cortex (ICBM152 lateral surface: gyri, sulci & Brodmann areas)"],
  ["th", "Thalamus, Basal Ganglia & Internal Capsule (ICBM152 coronal slice)"],
  ["rmb", "Rostral midbrain: superior colliculus, red nucleus, cerebral peduncle"],
  ["cmb", "Caudal midbrain: inferior colliculus, SCP decussation"],
  ["rp", "Rostral pons: trigeminal nuclei, SCP, basis pontis"],
  ["cp", "Caudal pons: facial colliculus, trapezoid body, MCP"],
  ["cbl", "Cerebellum: folia, vermis, dentate nucleus & peduncles"],
  ["rm", "Rostral medulla: crumpled inferior olive, open 4th ventricle, ICP"],
  ["mm", "Mid medulla: sensory decussation (internal arcuate fibres)"],
  ["cm", "Caudal medulla: pyramidal (motor) decussation"],
  ["c", "Cervical spinal cord: butterfly gray horns, funiculi & commissure"]
];

let sel = null;
let currentMode = "vector"; // Default to clean Vector Atlas mode
let currentLat = "pathway";
let filterActiveOnly = true; // Auto-filter to active slices when a tract is selected!
let showDecussations = true;
let activeCategory = "all";
let searchQuery = "";
let spotlightSlice = null;   // The slice currently expanded as the biggest/zoomed hero card
let brain3d = null;

const $ = s => document.querySelector(s);

function lab(lv) {
  const L = [];
  T.forEach(t => {
    const g = {};
    (t.loc[lv] || []).forEach(s => (g[s[4] || ""] = g[s[4] || ""] || []).push(s));
    for (const k in g) {
      const q = g[k].reduce((a, b) => b[0] + b[2] > a[0] + a[2] ? b : a);
      L.push({ t, k, x: 100 + q[0] + q[2], y: q[1] });
    }
  });
  const d = Math.min(10, 184 / Math.max(L.length - 1, 1));
  L.sort((a, b) => a.y - b.y);
  let p = 9 - d;
  L.forEach(l => { l.ly = Math.max(l.y, p + d); p = l.ly; });
  let m = 193;
  for (let i = L.length - 1; i >= 0; i--) {
    L[i].ly = Math.min(L[i].ly, m);
    m = L[i].ly - d;
  }
  return L.map(l => `<g class="lg" data-id="${l.t.id}"><polyline class="ld" points="${l.x},${l.y} 206,${l.ly}"/><text class="lab" x="209" y="${l.ly + 2.7}">${l.k || l.t.n.replace(/ ?\([^)]*\)/g, "")}</text></g>`).join("");
}

function renderDecussations(lv) {
  const list = DEC_PATHS[lv] || [];
  return list.map(dc => {
    const t = T.find(x => x.id === dc.id);
    const col = t ? t.col : "var(--dec)";
    return `<path class="dec-path" data-id="${dc.id}" d="${dc.d}" stroke="${col}" style="color:${col}"><title>${dc.name}</title></path>
      <text class="dec-marker" data-id="${dc.id}" x="${dc.mx}" y="${dc.my}">✕</text>`;
  }).join("");
}

function sh(lv) {
  let s = base[lv]() + renderDecussations(lv);
  const customLv = CUSTOM_SHAPES[lv] || {};
  T.forEach(t => (t.loc[lv] || []).forEach(([dx, y, rx, ry, lb], idx) => {
    const customPath = customLv[`${t.id}:${idx}`];
    [-1, 1].forEach(k => {
      const side = k === -1 ? "L" : "R";
      const cx = 100 + k * dx;
      const title = `${lb || t.n} (${side === "L" ? "Left / Ipsilateral ref" : "Right / Contralateral ref"})`;
      if (customPath) {
        const tf = k === -1 ? ` transform="translate(200,0) scale(-1,1)"` : "";
        s += `<path class="sh" data-id="${t.id}" data-side="${side}" d="${customPath}"${tf} fill="${t.col}" style="color:${t.col}"><title>${title}</title></path>`;
      } else {
        s += `<ellipse class="sh" data-id="${t.id}" data-side="${side}" cx="${cx}" cy="${y}" rx="${rx}" ry="${ry}" fill="${t.col}" style="color:${t.col}"><title>${title}</title></ellipse>`;
      }
      s += `<text class="ar ${t.d == "a" ? "u" : t.d == "d" ? "d" : "b"}" data-id="${t.id}" data-side="${side}" x="${cx}" y="${y + 3}">${AR[t.d]}</text>`;
    });
  }));
  return lab(lv) + s + '<text class="lb" x="100" y="10" style="font-size:7.5px">Dorsal (Posterior)</text><text class="lb" x="100" y="197" style="font-size:7.5px">Ventral (Anterior)</text>';
}

const fore = k => base[k]() + FB[k].map(([id, x, y, rx, ry], i) =>
  `<ellipse class="st" data-id="${id}" cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="hsl(${(i * 47 + (k == "cx" ? 200 : 20)) % 360} 58% 48%)"><title>${ST[id][0]}</title></ellipse><text class="lb" x="${x}" y="${y + 2.5}">${id}</text>`
).join("");

// Build Cross-Section Grid with Spotlight/Zoom button & edge resizers on every card
$("#grid").innerHTML = SEC.map(([k, n]) => {
  const w = FB[k];
  return `<div class="card sec" id="s-${k}" data-slice="${k}">
    <div class="sec-head">
      <h4 data-zoom-slice="${k}" title="Click to expand/spotlight this slice">${n}</h4>
      <div class="sec-badges">
        <span class="slice-dec-badge">✕ Decussates here</span>
        <span class="sec-side-badge"></span>
        <button type="button" class="zoom-slice-btn" data-zoom-slice="${k}" title="Expand this slice as the largest zoomed view">⤢ Spotlight</button>
      </div>
    </div>
    <svg viewBox="0 0 ${w ? 400 : 360} 200">${w ? fore(k) : sh(k)}</svg>
    <div class="resize-edge resize-edge-r" data-resize-sec="w" title="Drag edge to make slice cards wider or narrower (double-click to reset)"></div>
    <div class="resize-edge resize-edge-b" data-resize-sec="h" title="Drag bottom edge to adjust slice height (double-click to reset)"></div>
    <div class="resize-corner" data-resize-sec="wh" title="Drag corner to resize slice card (double-click to reset)"></div>
  </div>`;
}).join("");

function updateSliceImageMode() {
  document.body.dataset.mode = currentMode;
  if (currentMode === "vector") return;
  document.querySelectorAll(".slice-img").forEach(img => {
    const lv = img.dataset.lv;
    img.setAttribute("href", `assets/slices/${lv}_${currentMode}.png`);
  });
}

function setSpotlightSlice(sliceKey, scroll = false) {
  spotlightSlice = spotlightSlice === sliceKey ? null : sliceKey;
  document.querySelectorAll(".sec").forEach(secEl => {
    const isSpot = secEl.dataset.slice === spotlightSlice;
    secEl.classList.toggle("spotlight", isSpot);
    const btn = secEl.querySelector(".zoom-slice-btn");
    if (btn) btn.textContent = isSpot ? "⤡ Collapse" : "⤢ Spotlight";
  });
  if (spotlightSlice && brain3d) {
    brain3d.setActiveSlice(spotlightSlice);
  }
  if (scroll && spotlightSlice) {
    const el = $("#s-" + spotlightSlice);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
}

function getSubNucleiForTract(t) {
  const set = new Set();
  Object.values(t.loc || {}).forEach(arr => arr.forEach(s => { if (s[4]) set.add(s[4]); }));
  return [...set];
}

function renderSidebar() {
  const q = searchQuery.trim().toLowerCase();
  let html = "";
  let totalMatches = 0;

  if (activeCategory !== "st") {
    G.forEach(([groupName, dCode]) => {
      if (activeCategory !== "all" && activeCategory !== dCode) return;
      const items = T.filter(t => {
        if (t.d !== dCode) return false;
        if (!q) return true;
        const subNuc = getSubNucleiForTract(t).join(" ").toLowerCase();
        const hay = `${t.n} ${t.id} ${subNuc} ${t.o || ""} ${t.f || ""} ${t.l || ""} ${t.x || ""}`.toLowerCase();
        return hay.includes(q);
      });
      if (!items.length) return;
      totalMatches += items.length;
      html += `<h3><span>${groupName}</span><span>${items.length}</span></h3>`;
      html += items.map(t => {
        const subNuc = getSubNucleiForTract(t);
        const matchedSub = q && subNuc.find(sn => sn.toLowerCase().includes(q));
        return `<button class="it${sel === t.id ? " sel" : ""}" data-id="${t.id}" style="--c:${t.col}">
          <span class="dot" style="background:${t.col}"></span>
          <span class="it-text">
            ${t.n}
            ${matchedSub ? `<span class="it-sub">↳ ${matchedSub}</span>` : ""}
          </span>
          <span class="dr">${AR[dCode]}</span>
        </button>`;
      }).join("");
    });
  }

  if (activeCategory === "st" || (activeCategory === "all" && q.length > 0)) {
    const stItems = Object.entries(ST).filter(([id, [name, desc]]) => {
      if (!q) return true;
      return `${id} ${name} ${desc}`.toLowerCase().includes(q);
    });
    if (stItems.length) {
      totalMatches += stItems.length;
      html += `<h3><span>Brain Structures &amp; Nuclei</span><span>${stItems.length}</span></h3>`;
      html += stItems.map(([id, [name, desc]]) =>
        `<button class="it${sel === id ? " sel" : ""}" data-id="${id}" style="--c:var(--acc)">
          <span class="dot" style="background:var(--acc)"></span>
          <span class="it-text">
            ${name}
            <span class="it-sub">${id} · ${desc.slice(0, 48)}…</span>
          </span>
          <span class="dr">●</span>
        </button>`
      ).join("");
    }
  }

  if (!totalMatches) {
    html = `<div class="empty-search">No tracts, nuclei, or clinical syndromes match "<strong>${searchQuery}</strong>".</div>`;
  }
  $("#side").innerHTML = html;
}

const LV = [
  ["cx", "Cortex", 8, 44, "cx", 30, 170],
  ["bg", "Basal ganglia", 54, 84, "th", 100, 170],
  ["th", "Thalamus", 92, 120, "th", 40, 160],
  ["rmb", "Midbrain (rostral)", 134, 160, "rmb", 40, 160],
  ["cmb", "Midbrain (caudal)", 160, 184, "cmb", 40, 160],
  ["rp", "Pons (rostral)", 192, 216, "rp", 40, 160],
  ["cp", "Pons (caudal)", 216, 240, "cp", 40, 160],
  ["rm", "Medulla (rostral)", 256, 288, "rm", 44, 156],
  ["mm", "Medulla (mid)", 302, 334, "mm", 48, 152],
  ["cm", "Medulla (caudal)", 348, 378, "cm", 52, 148],
  ["cd", "Cord (cervical)", 404, 436, "c", 58, 142],
  ["cs", "Cord (lumbar)", 470, 502, "c", 58, 142]
];
const Y0 = { ...Y };

function layout() {
  const v = $("#dsv"), w = v.clientWidth, h = v.clientHeight;
  if (!w || !h) return;
  const H = Math.max(460, h * 210 / w), K = H / 520;
  for (const k in Y0) Y[k] = Y0[k] * K;
  v.setAttribute("viewBox", `0 0 210 ${H}`);
  v.innerHTML = LV.map(([k, n, a, b, s, x1, x2]) =>
    `<rect class="blk" data-s="${s}" x="${x1}" y="${a * K}" width="${x2 - x1}" height="${(b - a) * K}" rx="8"/><text class="bl" x="${(x1 + x2) / 2}" y="${(a + b) / 2 * K + 3}">${n}</text>`
  ).join("") + `<rect class="blk" x="168" y="${214 * K}" width="38" height="${52 * K}" rx="8" data-s="cbl"/><text class="bl" x="187" y="${244 * K}">Cb</text><g id="fl"></g>`;
  paint();
}

let shown;
let currentPathwaySlices = [];
let currentStepIdx = 0;

function getSlicesForItem(c) {
  if (!c) return [];
  const S0 = ST[c];
  if (S0) {
    const sList = [];
    Object.entries(FB).forEach(([k, arr]) => {
      if (arr.some(x => x[0] === c)) sList.push(k);
    });
    const relTracts = T.filter(t => (TG[t.id] || []).includes(c));
    SEC.forEach(([k]) => {
      if (!sList.includes(k) && relTracts.some(t => (t.loc[k] || []).length)) sList.push(k);
    });
    return sList;
  }
  const t = T.find(x => x.id === c);
  if (!t) return [];
  return SEC.map(([k]) => k).filter(k => {
    if ((t.loc[k] || []).length > 0) return true;
    if (FB[k] && FB[k].some(([id]) => (TG[t.id] || []).includes(id))) return true;
    return false;
  });
}

// Pick the best default Spotlight slice when a user selects a tract (prefers its decussation level, or its origin/first brainstem slice)
function pickBestSpotlightForItem(c, activeSlices) {
  if (!c || !activeSlices.length) return null;
  for (const lv of activeSlices) {
    if ((DEC_PATHS[lv] || []).some(d => d.id === c)) return lv;
  }
  const nonForebrain = activeSlices.find(k => !FB[k]);
  return nonForebrain || activeSlices[0];
}

function paint() {
  const c = sel;
  const S0 = ST[c];
  const A = new Set(S0 ? T.filter(t => (TG[t.id] || []).includes(c)).map(t => t.id) : c ? [c] : []);
  const activeTract = T.find(x => x.id === c);

  document.querySelectorAll(".sec").forEach(secEl => {
    const lv = secEl.dataset.slice;
    const sides = activeTract ? getActiveSidesForSlice(activeTract, lv) : { L: true, R: true };
    let secHasActive = false;
    let secHasDec = false;

    secEl.querySelectorAll(".sh").forEach(e => {
      const o = A.has(e.dataset.id);
      if (o) secHasActive = true;
      e.classList.toggle("on", o);
      e.classList.toggle("dim", !!c && !o);
      const side = e.dataset.side;
      const isGhost = o && activeTract && side && !sides[side];
      e.classList.toggle("contra-ghost", !!isGhost);
    });

    secEl.querySelectorAll(".ar").forEach(e => {
      const o = A.has(e.dataset.id);
      e.classList.toggle("on", o);
      const side = e.dataset.side;
      const isGhost = o && activeTract && side && !sides[side];
      e.classList.toggle("contra-ghost", !!isGhost);
    });

    secEl.querySelectorAll(".st").forEach(e => {
      const id = e.dataset.id;
      const o = id == c || (!S0 && (TG[c] || []).includes(id));
      if (o) secHasActive = true;
      e.classList.toggle("on", o);
      e.classList.toggle("dim", !!c && !o);
    });

    secEl.querySelectorAll(".lg").forEach(e => {
      const o = A.has(e.dataset.id);
      e.classList.toggle("on", o);
      e.classList.toggle("dim", !!c && !o);
    });

    secEl.querySelectorAll(".dec-path").forEach(e => {
      const o = A.has(e.dataset.id);
      if (o) secHasDec = true;
      e.classList.toggle("on", o);
      e.classList.toggle("dim", !!c && !o);
    });

    secEl.querySelectorAll(".dec-marker").forEach(e => {
      e.classList.toggle("on", A.has(e.dataset.id));
    });

    secEl.classList.toggle("has-active", !!c && secHasActive);
    secEl.classList.toggle("has-active-dec", !!c && secHasDec);

    const sideBadge = secEl.querySelector(".sec-side-badge");
    if (sideBadge) {
      if (activeTract && secHasActive && !FB[lv]) {
        sideBadge.textContent = sides.L && sides.R ? "Bilateral / Crossing" : sides.L ? "Left (Ipsilateral)" : "Right (Contralateral)";
      } else {
        sideBadge.textContent = "";
      }
    }

    // Filter out non-active slices when a tract/structure is selected and filterActiveOnly is on
    secEl.classList.toggle("filtered-out", filterActiveOnly && !!c && !secHasActive);
  });

  document.querySelectorAll(".it").forEach(e => e.classList.toggle("sel", e.dataset.id == sel));

  // 2D Longitudinal Schematic Flow + Crossover Nodes
  const flEl = $("#fl");
  if (flEl) {
    if (activeTract) {
      let svgFlow = "";
      activeTract.p.split("|").forEach(p => {
        const pts = p.trim().split(/\s+/).map(q => {
          const [s, l] = q.split(":");
          return { s, l, x: X[s], y: Y[l] };
        });
        svgFlow += `<polyline class="flow ${activeTract.d}" stroke="${activeTract.col}" style="color:${activeTract.col}" points="${pts.map(pt => `${pt.x},${pt.y}`).join(" ")}"/>`;
        for (let idx = 0; idx < pts.length - 1; idx++) {
          if ((pts[idx].s === "L" && pts[idx + 1].s === "R") || (pts[idx].s === "R" && pts[idx + 1].s === "L")) {
            const mx = (pts[idx].x + pts[idx + 1].x) / 2;
            const my = (pts[idx].y + pts[idx + 1].y) / 2;
            svgFlow += `<circle class="dec-node" cx="${mx}" cy="${my}" r="4.5"><title>Decussation</title></circle>`;
          }
        }
      });
      flEl.innerHTML = svgFlow;
    } else {
      flEl.innerHTML = "";
    }
  }

  // Update 3D Brain Pathway & Slice Highlights
  const activeSlices = getSlicesForItem(c);
  if (brain3d) {
    brain3d.setTractPathway(activeTract || null);
    brain3d.highlightTractSlices(new Set(activeSlices));
  }

  currentPathwaySlices = activeSlices;
  const stepper = $("#pathway-stepper");
  const showAllBtn = $("#show-all-slices-btn");
  const statusEl = $("#grid-status");

  if (c && activeSlices.length > 0) {
    stepper.classList.remove("hidden");
    showAllBtn.classList.toggle("hidden", !filterActiveOnly);
    const spotIdx = activeSlices.indexOf(spotlightSlice);
    if (spotIdx !== -1) currentStepIdx = spotIdx;
    else if (currentStepIdx >= activeSlices.length) currentStepIdx = 0;
    $("#step-indicator").textContent = `Slice ${currentStepIdx + 1} / ${activeSlices.length}`;
    statusEl.textContent = filterActiveOnly
      ? `Showing ${activeSlices.length} active slices for ${activeTract ? activeTract.n : ST[c][0]} · Click any slice to Spotlight`
      : `Highlighted across ${activeSlices.length} of 11 levels`;
  } else {
    stepper.classList.add("hidden");
    showAllBtn.classList.add("hidden");
    statusEl.textContent = "Showing all 11 anatomical levels — click any slice header or '⤢ Spotlight' to zoom in";
  }

  // Update Inspector Card (#info)
  const k = sel;
  if (k === shown) return;
  shown = k;
  $("#info").scrollTop = 0;
  const i = T.find(x => x.id == k), s = ST[k];

  if (s) {
    const relTracts = T.filter(t => (TG[t.id] || []).includes(k));
    $("#info").style.setProperty("--c", "var(--acc)");
    $("#info").innerHTML = `
      <div class="info-top">
        <div class="info-title-wrap">
          <h2>${s[0]}</h2>
          <span class="bdg" style="background:var(--acc)">● Anatomical Nucleus / Region (${k})</span>
        </div>
        ${sel ? `<button type="button" class="unpin-btn" id="unpin-btn">Unpin ✕</button>` : ""}
      </div>
      <p style="margin:4px 0">${s[1]}</p>
      ${relTracts.length ? `<div class="related-pills">
        <span style="font-size:11px;color:var(--mut);align-self:center">Connected tracts:</span>
        ${relTracts.map(rt => `<button type="button" class="rel-pill" data-jump-id="${rt.id}"><span class="dot" style="background:${rt.col}"></span>${rt.n}</button>`).join("")}
      </div>` : ""}`;
    return;
  }

  if (i) {
    $("#info").style.setProperty("--c", i.col);
    const decLevels = Object.entries(DEC_PATHS).filter(([, arr]) => arr.some(d => d.id === i.id)).map(([lv]) => lv);
    const relStructs = (TG[i.id] || []).filter(stId => ST[stId]);
    $("#info").innerHTML = `
      <div class="info-top">
        <div class="info-title-wrap">
          <h2 style="--c:${i.col}">${i.n}</h2>
          <span class="bdg" style="background:${i.col}">${AR[i.d]} ${LN[i.d]}</span>
          ${decLevels.length ? `<span class="bdg-dec">✕ Decussation shown in slice</span>` : ""}
        </div>
        ${sel ? `<button type="button" class="unpin-btn" id="unpin-btn">Unpin ✕</button>` : ""}
      </div>
      <dl>
        <dt>Origin</dt><dd>${i.o}</dd>
        <dt>Course</dt><dd>${i.c}</dd>
        <dt>Decussation</dt><dd>${i.x}</dd>
        <dt>Termination</dt><dd>${i.t}</dd>
        <dt>Function</dt><dd>${i.f}</dd>
        <dt>Clinical</dt><dd class="cl">${i.l}</dd>
      </dl>
      ${relStructs.length ? `<div class="related-pills">
        <span style="font-size:11px;color:var(--mut);align-self:center">Key structures:</span>
        ${relStructs.map(stId => `<button type="button" class="rel-pill" data-jump-id="${stId}">● ${ST[stId][0]}</button>`).join("")}
      </div>` : ""}`;
  } else {
    $("#info").style.setProperty("--c", "var(--acc)");
    $("#info").innerHTML = `
      <div class="info-top">
        <h2>Explore a Tract, Cranial Nerve, or Brain Nucleus</h2>
      </div>
      <p style="color:var(--mut);margin:0">
        Select any tract on the left to automatically pull up only the slices where it is present, with its key slice expanded in <strong>Spotlight</strong> mode. Click <strong>⤢ Spotlight</strong> on any other slice to make it the largest zoomed view.
      </p>`;
  }
}

function selectItem(id) {
  sel = sel === id ? null : id;
  currentStepIdx = 0;
  if (sel) {
    const slices = getSlicesForItem(sel);
    const best = pickBestSpotlightForItem(sel, slices);
    spotlightSlice = null;
    if (best) setSpotlightSlice(best, false);
  } else {
    setSpotlightSlice(null, false);
  }
  paint();
  renderSidebar();
}

function jumpToSlice(sliceKey) {
  const s = $("#s-" + sliceKey);
  if (!s) return;
  if (s.classList.contains("filtered-out")) {
    filterActiveOnly = false;
    $("#filter-active-btn").classList.remove("active");
    paint();
  }
  spotlightSlice = null;
  setSpotlightSlice(sliceKey, true);
  s.classList.add("fl");
  setTimeout(() => s.classList.remove("fl"), 1300);
  if (brain3d) brain3d.setActiveSlice(sliceKey);
  document.querySelectorAll(".blk").forEach(b => b.classList.toggle("active-lv", b.dataset.s === sliceKey));
}

const pick = e => {
  const el = e.target.closest("[data-id]");
  return el ? el.dataset.id : null;
};

// Click-only selection (hovering does not change the active selection or filter slices)
document.addEventListener("click", e => {
  if (e.target.closest("#quiz-stage") || e.target.closest(".modal-backdrop")) return;
  if (e.target.closest("#unpin-btn")) {
    selectItem(sel); // toggles off
    return;
  }
  const zoomBtn = e.target.closest("[data-zoom-slice]");
  if (zoomBtn) {
    setSpotlightSlice(zoomBtn.dataset.zoomSlice, true);
    paint();
    return;
  }
  const jumpPill = e.target.closest("[data-jump-id]");
  if (jumpPill) {
    sel = null;
    selectItem(jumpPill.dataset.jumpId);
    return;
  }
  const i = pick(e);
  if (i) {
    selectItem(i);
    return;
  }
  const secCard = e.target.closest(".sec");
  if (secCard && secCard.dataset.slice && brain3d) {
    brain3d.setActiveSlice(secCard.dataset.slice);
    document.querySelectorAll(".blk").forEach(b => b.classList.toggle("active-lv", b.dataset.s === secCard.dataset.slice));
    return;
  }
  const b = e.target.closest(".blk");
  if (b && b.dataset.s) {
    jumpToSlice(b.dataset.s);
  }
});

// Search Bar & Category Tabs Events
const searchInput = $("#search-input");
const searchClear = $("#search-clear");
const searchKbd = $("#search-kbd");

searchInput.addEventListener("input", () => {
  searchQuery = searchInput.value;
  searchClear.classList.toggle("hidden", !searchQuery);
  searchKbd.classList.toggle("hidden", !!searchQuery);
  renderSidebar();
});

searchClear.addEventListener("click", () => {
  searchInput.value = "";
  searchQuery = "";
  searchClear.classList.add("hidden");
  searchKbd.classList.remove("hidden");
  renderSidebar();
  searchInput.focus();
});

document.addEventListener("keydown", e => {
  if (e.key === "/" && document.activeElement !== searchInput) {
    e.preventDefault();
    searchInput.focus();
  } else if (e.key === "Escape") {
    if (document.activeElement === searchInput && searchQuery) {
      searchClear.click();
    } else if (sel) {
      selectItem(sel);
    }
  }
});

$("#cat-tabs").addEventListener("click", e => {
  const btn = e.target.closest(".cat-tab");
  if (!btn) return;
  activeCategory = btn.dataset.cat;
  document.querySelectorAll(".cat-tab").forEach(b => b.classList.toggle("active", b === btn));
  renderSidebar();
});

// Toolbar Controls
document.body.dataset.mode = currentMode;
document.body.dataset.lat = currentLat;
document.body.classList.add("show-dec");

$("#mode-ctrl").addEventListener("click", e => {
  const btn = e.target.closest(".seg-btn");
  if (!btn) return;
  currentMode = btn.dataset.mode;
  updateSliceImageMode();
  $("#mode-ctrl").querySelectorAll(".seg-btn").forEach(b => b.classList.toggle("active", b === btn));
});

$("#lat-ctrl").addEventListener("click", e => {
  const btn = e.target.closest(".seg-btn");
  if (!btn) return;
  currentLat = btn.dataset.lat;
  document.body.dataset.lat = currentLat;
  $("#lat-ctrl").querySelectorAll(".seg-btn").forEach(b => b.classList.toggle("active", b === btn));
  paint();
});

$("#filter-active-btn").addEventListener("click", e => {
  filterActiveOnly = !filterActiveOnly;
  e.currentTarget.classList.toggle("active", filterActiveOnly);
  paint();
});

$("#show-all-slices-btn").addEventListener("click", () => {
  filterActiveOnly = false;
  $("#filter-active-btn").classList.remove("active");
  paint();
});

$("#show-dec-btn").addEventListener("click", e => {
  showDecussations = !showDecussations;
  e.currentTarget.classList.toggle("active", showDecussations);
  document.body.classList.toggle("show-dec", showDecussations);
});

$("#viz-ctrl").addEventListener("click", e => {
  const btn = e.target.closest(".seg-btn");
  if (!btn) return;
  $("#dia").dataset.viz = btn.dataset.viz;
  $("#viz-ctrl").querySelectorAll(".seg-btn").forEach(b => b.classList.toggle("active", b === btn));
  setTimeout(() => {
    layout();
    if (brain3d) brain3d.resize();
  }, 50);
});

$("#reset-cam-btn").addEventListener("click", () => {
  if (brain3d) brain3d.resetCamera();
});

$("#zoom-in-3d")?.addEventListener("click", () => {
  if (brain3d) brain3d.zoomBy(0.8);
});

$("#zoom-out-3d")?.addEventListener("click", () => {
  if (brain3d) brain3d.zoomBy(1.25);
});

const brainOpacityInput = $("#brain-opacity");
const brainOpacityVal = $("#brain-opacity-val");
if (brainOpacityInput) {
  brainOpacityInput.addEventListener("input", () => {
    const v = parseFloat(brainOpacityInput.value);
    if (brainOpacityVal) brainOpacityVal.textContent = `${Math.round(v * 100)}%`;
    if (brain3d) brain3d.setOpacity(v);
  });
}

$("#step-prev").addEventListener("click", () => {
  if (!currentPathwaySlices.length) return;
  currentStepIdx = (currentStepIdx - 1 + currentPathwaySlices.length) % currentPathwaySlices.length;
  const k = currentPathwaySlices[currentStepIdx];
  spotlightSlice = null;
  setSpotlightSlice(k, true);
  paint();
});

$("#step-next").addEventListener("click", () => {
  if (!currentPathwaySlices.length) return;
  currentStepIdx = (currentStepIdx + 1) % currentPathwaySlices.length;
  const k = currentPathwaySlices[currentStepIdx];
  spotlightSlice = null;
  setSpotlightSlice(k, true);
  paint();
});

// Theme Toggle
$("#theme-btn").addEventListener("click", () => {
  const root = document.documentElement;
  const isDark = root.dataset.theme === "dark" || (!root.dataset.theme && window.matchMedia("(prefers-color-scheme: dark)").matches);
  root.dataset.theme = isDark ? "light" : "dark";
});

// Section Size Slider
const sz = $("#sz");
try {
  const v = localStorage.getItem("sz");
  if (v) sz.value = v;
} catch (e) {}
const setSz = () => {
  $("#grid").style.setProperty("--sw", sz.value + "px");
  try { localStorage.setItem("sz", sz.value); } catch (e) {}
};
sz.oninput = setSz;
setSz();

// ---- Interactive Edge Drag-to-Resize for All Major Panels & Cards ----
(function initPanelResizers() {
  const appLayout = $("#app-layout");
  const sidePanel = $("#side-panel");
  const diaPanel = $("#dia");
  const brain3dWrap = $("#brain3d-wrap");
  const dsvWrap = $("#dsv-wrap");
  const infoPanel = $("#info");
  const gridEl = $("#grid");

  // Restore saved panel sizes
  try {
    const savedSideW = localStorage.getItem("neuraxis_side_w");
    if (savedSideW) appLayout.style.setProperty("--side-w", savedSideW + "px");
    const savedDiaW = localStorage.getItem("neuraxis_dia_w");
    if (savedDiaW) appLayout.style.setProperty("--dia-w", savedDiaW + "px");
  } catch (e) {}

  function attachDrag(handleEl, { onStart, onMove, onReset }) {
    if (!handleEl) return;
    let startX = 0, startY = 0, state = null;

    handleEl.addEventListener("pointerdown", e => {
      if (e.button !== 0) return;
      e.preventDefault();
      e.stopPropagation();
      startX = e.clientX;
      startY = e.clientY;
      state = onStart ? onStart(e) : {};
      handleEl.setPointerCapture(e.pointerId);
      handleEl.classList.add("dragging");
      document.body.classList.add("is-resizing");
    });

    handleEl.addEventListener("pointermove", e => {
      if (!handleEl.hasPointerCapture(e.pointerId)) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      onMove(dx, dy, state, e);
    });

    const endDrag = e => {
      if (!handleEl.classList.contains("dragging")) return;
      handleEl.classList.remove("dragging");
      document.body.classList.remove("is-resizing");
      try { handleEl.releasePointerCapture(e.pointerId); } catch (_) {}
    };
    handleEl.addEventListener("pointerup", endDrag);
    handleEl.addEventListener("pointercancel", endDrag);

    if (onReset) {
      handleEl.addEventListener("dblclick", e => {
        e.preventDefault();
        e.stopPropagation();
        onReset(e);
      });
    }
  }

  // 1. Left Sidebar Width Resizer (#resize-side)
  attachDrag($("#resize-side"), {
    onStart: () => ({ w0: sidePanel.getBoundingClientRect().width }),
    onMove: (dx, _dy, st) => {
      const w = Math.round(Math.max(170, Math.min(540, st.w0 + dx)));
      appLayout.style.setProperty("--side-w", w + "px");
      try { localStorage.setItem("neuraxis_side_w", String(w)); } catch (e) {}
      if (brain3d) brain3d.resize();
    },
    onReset: () => {
      appLayout.style.removeProperty("--side-w");
      try { localStorage.removeItem("neuraxis_side_w"); } catch (e) {}
      if (brain3d) brain3d.resize();
    }
  });

  // 2. Center 3D/2D Explorer Width Resizer (#resize-dia)
  attachDrag($("#resize-dia"), {
    onStart: () => ({ w0: diaPanel.getBoundingClientRect().width }),
    onMove: (dx, _dy, st) => {
      const w = Math.round(Math.max(210, Math.min(820, st.w0 + dx)));
      appLayout.style.setProperty("--dia-w", w + "px");
      try { localStorage.setItem("neuraxis_dia_w", String(w)); } catch (e) {}
      layout();
      if (brain3d) brain3d.resize();
    },
    onReset: () => {
      appLayout.style.removeProperty("--dia-w");
      try { localStorage.removeItem("neuraxis_dia_w"); } catch (e) {}
      layout();
      if (brain3d) brain3d.resize();
    }
  });

  // 3. Horizontal Split Resizer between 3D Brain & 2D Schematic (#resize-dia-split)
  attachDrag($("#resize-dia-split"), {
    onStart: () => ({
      h3d: brain3dWrap.getBoundingClientRect().height,
      h2d: dsvWrap.getBoundingClientRect().height
    }),
    onMove: (_dx, dy, st) => {
      const total = Math.max(220, st.h3d + st.h2d);
      const new3d = Math.max(95, Math.min(total - 95, st.h3d + dy));
      const new2d = total - new3d;
      diaPanel.style.setProperty("--dia-3d-flex", (new3d / total * 2.3).toFixed(3));
      diaPanel.style.setProperty("--dia-2d-flex", (new2d / total * 2.3).toFixed(3));
      layout();
      if (brain3d) brain3d.resize();
    },
    onReset: () => {
      diaPanel.style.removeProperty("--dia-3d-flex");
      diaPanel.style.removeProperty("--dia-2d-flex");
      layout();
      if (brain3d) brain3d.resize();
    }
  });

  // 4. Clinical Inspector Height Resizer (#resize-info)
  attachDrag($("#resize-info"), {
    onStart: () => ({ h0: infoPanel.getBoundingClientRect().height }),
    onMove: (_dx, dy, st) => {
      const h = Math.round(Math.max(72, Math.min(640, st.h0 + dy)));
      infoPanel.style.setProperty("--info-h", h + "px");
    },
    onReset: () => {
      infoPanel.style.removeProperty("--info-h");
    }
  });

  // 5. Cross-Section Slice Cards Width & Height Resizers ([data-resize-sec])
  document.querySelectorAll("[data-resize-sec]").forEach(handle => {
    const mode = handle.dataset.resizeSec; // 'w', 'h', or 'wh'
    const card = handle.closest(".sec");
    const svgEl = card.querySelector("svg");
    attachDrag(handle, {
      onStart: () => ({
        w0: card.getBoundingClientRect().width,
        h0: svgEl.getBoundingClientRect().height,
        isSpot: card.classList.contains("spotlight")
      }),
      onMove: (dx, dy, st) => {
        if ((mode === "w" || mode === "wh") && !st.isSpot) {
          const newW = Math.round(Math.max(200, Math.min(820, st.w0 + dx)));
          gridEl.style.setProperty("--sw", newW + "px");
          if (sz) sz.value = String(Math.min(680, Math.max(260, newW)));
          try { localStorage.setItem("sz", String(newW)); } catch (e) {}
        }
        if (mode === "h" || mode === "wh") {
          const newH = Math.round(Math.max(120, Math.min(900, st.h0 + dy)));
          if (st.isSpot) {
            card.style.setProperty("--spot-h", newH + "px");
          } else {
            gridEl.style.setProperty("--sec-h", newH + "px");
          }
        }
      },
      onReset: () => {
        gridEl.style.setProperty("--sw", "340px");
        gridEl.style.removeProperty("--sec-h");
        card.style.removeProperty("--spot-h");
        if (sz) sz.value = "340";
        try { localStorage.setItem("sz", "340"); } catch (e) {}
      }
    });
  });
})();

// ---- Help (?) Modal & Interactive "Quiz Me!" Game Engine ----
(function initHelpAndQuiz() {
  const helpModal = $("#help-modal");
  const quizModal = $("#quiz-modal");
  const quizStage = $("#quiz-stage");
  const sliceChecksContainer = $("#quiz-slice-checks");
  const poolInfoEl = $("#quiz-pool-info");
  const startQuizBtn = $("#quiz-start-btn");

  const quizConfig = {
    mode: "mcq",     // 'mcq' | 'type' | 'label'
    anim: "show",    // 'show' | 'hide'
    count: 10,
    slices: new Set(SEC.map(([k]) => k))
  };

  let quizState = null; // Active quiz runtime state

  // --- Help (?) Modal ---
  const openHelp = () => helpModal?.classList.remove("hidden");
  const closeHelp = () => helpModal?.classList.add("hidden");
  $("#help-btn")?.addEventListener("click", openHelp);
  $("#help-close-btn")?.addEventListener("click", closeHelp);
  $("#help-got-it-btn")?.addEventListener("click", closeHelp);
  helpModal?.addEventListener("click", e => { if (e.target === helpModal) closeHelp(); });

  // --- Build Quiz Pool for Selected Slices ---
  function getItemsForSlice(lv) {
    const sliceTitle = (SEC.find(([k]) => k === lv) || [lv, lv])[1];
    if (FB[lv]) {
      const seen = new Set();
      const items = [];
      FB[lv].forEach(([id], idx) => {
        if (seen.has(id) || !ST[id]) return;
        seen.add(id);
        items.push({
          uid: `${lv}:${id}`,
          lv,
          sliceTitle,
          isFB: true,
          id,
          subIdx: idx,
          displayName: ST[id][0],
          shortName: ST[id][0].replace(/\s*\([^)]*\)/g, ""),
          tractName: ST[id][0],
          direction: "st",
          explanation: ST[id][1],
          acceptNames: [id, ST[id][0], ST[id][0].replace(/\s*\([^)]*\)/g, "")]
        });
      });
      return items;
    } else {
      const items = [];
      T.forEach(t => {
        const locs = t.loc[lv] || [];
        if (!locs.length) return;
        // Group by sub-nucleus label within this tract on this slice
        const byLabel = new Map();
        locs.forEach((locArr, idx) => {
          const subLabel = locArr[4] || t.n;
          if (!byLabel.has(subLabel)) byLabel.set(subLabel, []);
          byLabel.get(subLabel).push(idx);
        });
        byLabel.forEach((indices, subLabel) => {
          const cleanTract = t.n.replace(/\s*\([^)]*\)/g, "");
          const displayName = subLabel !== t.n ? `${subLabel} (${cleanTract})` : t.n;
          items.push({
            uid: `${lv}:${t.id}:${indices.join(",")}`,
            lv,
            sliceTitle,
            isFB: false,
            id: t.id,
            indices,
            displayName,
            shortName: subLabel.replace(/\s*\([^)]*\)/g, ""),
            tractName: t.n,
            direction: t.d,
            explanation: `${t.f || ""} ${t.l ? "— Clinical: " + t.l : ""}`.trim(),
            acceptNames: [t.id, subLabel, t.n, cleanTract, subLabel.replace(/\s*\([^)]*\)/g, "")]
          });
        });
      });
      return items;
    }
  }

  function buildFullPool() {
    const pool = [];
    quizConfig.slices.forEach(lv => {
      pool.push(...getItemsForSlice(lv));
    });
    return pool;
  }

  function updateQuizSetupUI() {
    if (!sliceChecksContainer) return;
    sliceChecksContainer.innerHTML = SEC.map(([k, n]) => {
      const shortTitle = n.split(":")[0];
      const checked = quizConfig.slices.has(k) ? "checked" : "";
      const count = getItemsForSlice(k).length;
      return `<label class="qslice-check">
        <input type="checkbox" value="${k}" ${checked}>
        <span>${shortTitle} <small style="color:var(--mut)">(${count})</small></span>
      </label>`;
    }).join("");

    const pool = buildFullPool();
    if (poolInfoEl) {
      poolInfoEl.textContent = `${pool.length} testable structures across ${quizConfig.slices.size} selected slice${quizConfig.slices.size === 1 ? "" : "s"}`;
    }
    if (startQuizBtn) {
      startQuizBtn.disabled = pool.length === 0;
    }
  }

  sliceChecksContainer?.addEventListener("change", e => {
    const cb = e.target.closest("input[type='checkbox']");
    if (!cb) return;
    if (cb.checked) quizConfig.slices.add(cb.value);
    else quizConfig.slices.delete(cb.value);
    updateQuizSetupUI();
  });

  document.querySelectorAll("[data-slice-preset]").forEach(btn => {
    btn.addEventListener("click", () => {
      const p = btn.dataset.slicePreset;
      quizConfig.slices.clear();
      if (p === "all") SEC.forEach(([k]) => quizConfig.slices.add(k));
      else if (p === "stem") ["rmb", "cmb", "rp", "cp", "rm", "mm", "cm", "c"].forEach(k => quizConfig.slices.add(k));
      else if (p === "fore") ["cx", "th", "cbl"].forEach(k => quizConfig.slices.add(k));
      updateQuizSetupUI();
    });
  });

  $("#quiz-format-select")?.addEventListener("click", e => {
    const card = e.target.closest("[data-qmode]");
    if (!card) return;
    quizConfig.mode = card.dataset.qmode;
    $("#quiz-format-select").querySelectorAll(".qmode-card").forEach(c => c.classList.toggle("active", c === card));
  });

  $("#quiz-anim-select")?.addEventListener("click", e => {
    const btn = e.target.closest("[data-qanim]");
    if (!btn) return;
    quizConfig.anim = btn.dataset.qanim;
    $("#quiz-anim-select").querySelectorAll(".seg-btn").forEach(b => b.classList.toggle("active", b === btn));
  });

  $("#quiz-count-select")?.addEventListener("click", e => {
    const btn = e.target.closest("[data-qcount]");
    if (!btn) return;
    quizConfig.count = parseInt(btn.dataset.qcount, 10) || 10;
    $("#quiz-count-select").querySelectorAll(".seg-btn").forEach(b => b.classList.toggle("active", b === btn));
  });

  const openQuizModal = () => {
    updateQuizSetupUI();
    quizModal?.classList.remove("hidden");
  };
  const closeQuizModal = () => quizModal?.classList.add("hidden");

  $("#quiz-btn")?.addEventListener("click", openQuizModal);
  $("#quiz-close-btn")?.addEventListener("click", closeQuizModal);
  quizModal?.addEventListener("click", e => { if (e.target === quizModal) closeQuizModal(); });

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // Fuzzy / Synonym grader for "Type the Name" mode
  function normalizeAns(s) {
    return (s || "")
      .toLowerCase()
      .replace(/\b(tract|nucleus|nuclei|fasciculus|fascicles|fibres|fibers|pathway|system|lemniscus|area|gyrus|cortex|nerve|of|the|and)\b/g, " ")
      .replace(/[^a-z0-9]/g, "")
      .trim();
  }

  function editDistance(a, b) {
    const m = a.length, n = b.length;
    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        dp[i][j] = a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
    return dp[m][n];
  }

  function checkTypedAnswer(rawInput, item) {
    const cleanRaw = rawInput.trim().toLowerCase();
    if (!cleanRaw) return false;
    const normUser = normalizeAns(cleanRaw);

    for (const candidate of item.acceptNames) {
      const cLow = candidate.toLowerCase().trim();
      if (cleanRaw === cLow) return true;
      const normCand = normalizeAns(cLow);
      if (normUser && normCand && (normUser === normCand || (normUser.length >= 4 && normCand.includes(normUser)) || (normCand.length >= 4 && normUser.includes(normCand)))) {
        return true;
      }
      if (normUser.length >= 5 && normCand.length >= 5 && editDistance(normUser, normCand) <= 2) {
        return true;
      }
    }
    return false;
  }

  // Build an unlabelled SVG string for a slice (stripping <title> tooltips so hovering doesn't leak the answer)
  function buildQuizSliceSVG(lv) {
    const w = FB[lv];
    const rawSvg = w ? fore(lv) : sh(lv);
    const noTitles = rawSvg.replace(/<title>[\s\S]*?<\/title>/gi, "");
    return `<svg id="quiz-svg" viewBox="0 0 ${w ? 400 : 360} 200">${noTitles}</svg>`;
  }

  // --- Start Quiz ---
  startQuizBtn?.addEventListener("click", () => {
    closeQuizModal();
    launchQuizSession();
  });

  function launchQuizSession() {
    const fullPool = buildFullPool();
    if (!fullPool.length) return;

    document.body.classList.add("quiz-active");
    quizStage.classList.remove("hidden");

    if (quizConfig.mode === "label") {
      // In "Label the Slice" mode, each round is a selected slice with up to 8 distinct structures to label
      const sliceKeys = shuffle([...quizConfig.slices]).slice(0, quizConfig.count);
      const rounds = sliceKeys.map(lv => {
        const items = shuffle(getItemsForSlice(lv)).slice(0, 8);
        return { lv, sliceTitle: (SEC.find(([k]) => k === lv) || [lv, lv])[1], items };
      }).filter(r => r.items.length > 0);

      quizState = {
        mode: "label",
        rounds,
        idx: 0,
        score: 0,
        totalPossible: rounds.reduce((acc, r) => acc + r.items.length, 0),
        history: [],
        selectedBankUid: null,
        selectedNodeUid: null,
        matchedUids: new Set(),
        missedUids: new Set()
      };
      renderLabelRound();
    } else {
      // Multiple Choice ('mcq') or Type the Name ('type')
      const picked = shuffle(fullPool).slice(0, Math.min(quizConfig.count, fullPool.length));
      const questions = picked.map(item => {
        const distractors = shuffle(
          fullPool.filter(other => other.id !== item.id && other.displayName !== item.displayName)
        ).slice(0, 3);
        const options = shuffle([item, ...distractors]);
        return { item, options };
      });

      quizState = {
        mode: quizConfig.mode,
        questions,
        idx: 0,
        score: 0,
        totalPossible: questions.length,
        answered: false,
        history: []
      };
      renderQuestionRound();
    }
  }

  function sync3DForQuizItem(lv, item) {
    if (brain3d) {
      brain3d.setActiveSlice(lv);
      const tract = (!item || item.isFB || quizConfig.anim === "hide") ? null : T.find(x => x.id === item.id);
      brain3d.setTractPathway(tract || null);
      brain3d.highlightTractSlices(new Set([lv]));
    }
    document.querySelectorAll(".blk").forEach(b => b.classList.toggle("active-lv", b.dataset.s === lv));
  }

  // --- Render MCQ / Type-the-Name Question ---
  function renderQuestionRound() {
    if (!quizState || quizState.idx >= quizState.questions.length) {
      renderQuizSummary();
      return;
    }
    const q = quizState.questions[quizState.idx];
    const { item } = q;
    quizState.answered = false;

    sync3DForQuizItem(item.lv, item);

    const modeTitle = quizState.mode === "mcq" ? "Multiple Choice" : "Type the Name";
    const animClass = quizConfig.anim === "hide" ? "hide-quiz-anim" : "";

    quizStage.innerHTML = `
      <div class="quiz-topbar">
        <div class="quiz-meta">
          <span class="quiz-badge">🎓 ${modeTitle}</span>
          <strong>Question ${quizState.idx + 1} of ${quizState.questions.length}</strong>
          <span class="quiz-score-pill">Score: ${quizState.score} / ${quizState.idx}</span>
        </div>
        <div class="toolbar-right-actions">
          <button type="button" class="mini-btn" id="quiz-reconfig-btn">⚙ Settings</button>
          <button type="button" class="mini-btn" id="quiz-exit-btn">✕ Exit Quiz</button>
        </div>
      </div>

      <div class="quiz-main-grid">
        <div class="quiz-slice-box ${animClass}" id="quiz-slice-box">
          <div class="quiz-slice-title">${item.sliceTitle}</div>
          ${buildQuizSliceSVG(item.lv)}
        </div>

        <div class="quiz-qa-box">
          <p class="quiz-prompt">Identify the highlighted ${item.isFB ? "brain structure / nucleus" : "tract or cranial nerve structure"} on this slice:</p>
          <p class="quiz-subprompt">${quizConfig.anim === "show" && !item.isFB ? "Conduction direction arrows (▲/▼) are shown on the slice." : "Direction animations are hidden — identify by anatomical position."}</p>

          ${quizState.mode === "mcq" ? `
            <div class="mcq-list" id="quiz-mcq-list">
              ${q.options.map((opt, i) => `
                <button type="button" class="mcq-btn" data-opt-idx="${i}">
                  <span class="mcq-key">${i + 1}</span>
                  <span>${opt.displayName}</span>
                </button>
              `).join("")}
            </div>
          ` : `
            <form class="type-form" id="quiz-type-form">
              <input type="text" class="type-input" id="quiz-type-input" placeholder="Type tract, nucleus, or abbreviation (e.g. LCST, ML, CN III, VPL)…" autocomplete="off">
              <button type="submit" class="primary-btn" id="quiz-type-submit">Submit</button>
            </form>
          `}

          <div id="quiz-feedback-slot"></div>
        </div>
      </div>
    `;

    updateSliceImageMode();

    // Highlight only the target shape(s) inside #quiz-svg
    const svg = $("#quiz-svg");
    if (svg) {
      if (item.isFB) {
        svg.querySelectorAll(".st").forEach(el => {
          const isMatch = el.dataset.id === item.id;
          el.classList.toggle("quiz-target", isMatch);
          el.classList.toggle("quiz-dim", !isMatch);
        });
      } else {
        // Match specific sub-structure indices for this tract on this slice
        const shapesByTract = [...svg.querySelectorAll(`.sh[data-id="${item.id}"]`)];
        const arrowsByTract = [...svg.querySelectorAll(`.ar[data-id="${item.id}"]`)];
        const targetElemSet = new Set();
        const targetArrowSet = new Set();
        item.indices.forEach(subIdx => {
          // Each subIdx produces 2 elements (Left and Right)
          if (shapesByTract[subIdx * 2]) targetElemSet.add(shapesByTract[subIdx * 2]);
          if (shapesByTract[subIdx * 2 + 1]) targetElemSet.add(shapesByTract[subIdx * 2 + 1]);
          if (arrowsByTract[subIdx * 2]) targetArrowSet.add(arrowsByTract[subIdx * 2]);
          if (arrowsByTract[subIdx * 2 + 1]) targetArrowSet.add(arrowsByTract[subIdx * 2 + 1]);
        });

        svg.querySelectorAll(".sh").forEach(el => {
          const isMatch = targetElemSet.has(el);
          el.classList.toggle("quiz-target", isMatch);
          el.classList.toggle("quiz-dim", !isMatch);
        });

        if (quizConfig.anim === "show") {
          targetArrowSet.forEach(arEl => arEl.classList.add("on"));
        }
      }
    }

    $("#quiz-reconfig-btn")?.addEventListener("click", openQuizModal);
    $("#quiz-exit-btn")?.addEventListener("click", exitQuizMode);

    if (quizState.mode === "mcq") {
      $("#quiz-mcq-list")?.addEventListener("click", e => {
        const btn = e.target.closest(".mcq-btn");
        if (!btn || quizState.answered) return;
        const optIdx = parseInt(btn.dataset.optIdx, 10);
        submitMcqAnswer(optIdx);
      });
    } else {
      const inputEl = $("#quiz-type-input");
      inputEl?.focus();
      $("#quiz-type-form")?.addEventListener("submit", e => {
        e.preventDefault();
        if (quizState.answered) {
          quizState.idx++;
          renderQuestionRound();
          return;
        }
        submitTypeAnswer(inputEl.value);
      });
    }
  }

  function showQuestionFeedback(isCorrect, userAnswerText, item) {
    quizState.answered = true;
    if (isCorrect) quizState.score++;
    quizState.history.push({ item, isCorrect, userAnswerText });

    const slot = $("#quiz-feedback-slot");
    if (!slot) return;
    const isLast = quizState.idx + 1 >= quizState.questions.length;
    slot.innerHTML = `
      <div class="quiz-feedback ${isCorrect ? "ok" : "err"}">
        <strong>${isCorrect ? "✓ Correct!" : `✕ Incorrect — Correct answer: ${item.displayName}`}</strong>
        <div>${item.explanation || ""}</div>
      </div>
      <div style="display:flex;justify-content:flex-end;margin-top:10px">
        <button type="button" class="primary-btn" id="quiz-next-btn">${isLast ? "View Final Score →" : "Next Question →"}</button>
      </div>
    `;
    $("#quiz-next-btn")?.addEventListener("click", () => {
      quizState.idx++;
      renderQuestionRound();
    });
    $("#quiz-next-btn")?.focus();
  }

  function submitMcqAnswer(optIdx) {
    const q = quizState.questions[quizState.idx];
    const chosen = q.options[optIdx];
    const isCorrect = chosen.uid === q.item.uid;

    $("#quiz-mcq-list")?.querySelectorAll(".mcq-btn").forEach((btn, i) => {
      btn.disabled = true;
      if (q.options[i].uid === q.item.uid) btn.classList.add("correct");
      else if (i === optIdx && !isCorrect) btn.classList.add("wrong");
    });

    showQuestionFeedback(isCorrect, chosen.displayName, q.item);
  }

  function submitTypeAnswer(val) {
    const q = quizState.questions[quizState.idx];
    const isCorrect = checkTypedAnswer(val, q.item);
    const inputEl = $("#quiz-type-input");
    const submitBtn = $("#quiz-type-submit");
    if (inputEl) inputEl.disabled = true;
    if (submitBtn) submitBtn.disabled = true;
    showQuestionFeedback(isCorrect, val.trim() || "(Blank)", q.item);
  }

  // --- Render "Label the Slice" Mode ---
  function renderLabelRound() {
    if (!quizState || quizState.idx >= quizState.rounds.length) {
      renderQuizSummary();
      return;
    }
    const round = quizState.rounds[quizState.idx];
    quizState.selectedBankUid = null;
    quizState.selectedNodeUid = null;
    quizState.matchedUids = new Set();
    quizState.missedUids = new Set();

    sync3DForQuizItem(round.lv, null);

    const bankItems = shuffle(round.items);
    const animClass = quizConfig.anim === "hide" ? "hide-quiz-anim" : "";

    quizStage.innerHTML = `
      <div class="quiz-topbar">
        <div class="quiz-meta">
          <span class="quiz-badge">🎓 Label the Slice</span>
          <strong>Slice ${quizState.idx + 1} of ${quizState.rounds.length}</strong>
          <span class="quiz-score-pill" id="label-score-pill">Score: ${quizState.score} / ${quizState.totalPossible}</span>
        </div>
        <div class="toolbar-right-actions">
          <button type="button" class="mini-btn" id="quiz-reconfig-btn">⚙ Settings</button>
          <button type="button" class="mini-btn" id="quiz-exit-btn">✕ Exit Quiz</button>
        </div>
      </div>

      <div class="quiz-main-grid">
        <div class="quiz-slice-box label-mode ${animClass}" id="quiz-slice-box">
          <div class="quiz-slice-title">${round.sliceTitle}</div>
          ${buildQuizSliceSVG(round.lv)}
        </div>

        <div class="quiz-qa-box">
          <p class="quiz-prompt">Match all ${round.items.length} structures on this slice:</p>
          <p class="quiz-subprompt" id="label-instruction">Click a name below, then click its matching structure on the slice (or click a numbered structure on the slice first).</p>

          <div class="label-bank" id="quiz-label-bank">
            ${bankItems.map((it, idx) => `
              <button type="button" class="bank-pill" data-bank-uid="${it.uid}">
                ${it.displayName}
              </button>
            `).join("")}
          </div>

          <div id="quiz-feedback-slot"></div>
        </div>
      </div>
    `;

    updateSliceImageMode();

    // Mark the round's items as interactive numbered nodes on #quiz-svg
    const svg = $("#quiz-svg");
    if (svg) {
      round.items.forEach((it, idx) => {
        const pinNum = idx + 1;
        if (it.isFB) {
          const el = svg.querySelector(`.st[data-id="${it.id}"]`);
          if (el) {
            el.classList.add("quiz-label-node");
            el.dataset.nodeUid = it.uid;
            const cx = el.getAttribute("cx"), cy = el.getAttribute("cy");
            svg.insertAdjacentHTML("beforeend", `<text class="quiz-node-pin" data-pin-uid="${it.uid}" x="${cx}" y="${parseFloat(cy) + 2.5}">${pinNum}</text>`);
          }
        } else {
          const shapesByTract = [...svg.querySelectorAll(`.sh[data-id="${it.id}"]`)];
          const arrowsByTract = [...svg.querySelectorAll(`.ar[data-id="${it.id}"]`)];
          it.indices.forEach((subIdx, sIdx) => {
            const leftEl = shapesByTract[subIdx * 2];
            const rightEl = shapesByTract[subIdx * 2 + 1];
            [leftEl, rightEl].forEach(el => {
              if (!el) return;
              el.classList.add("quiz-label-node");
              el.dataset.nodeUid = it.uid;
            });
            if (quizConfig.anim === "show") {
              if (arrowsByTract[subIdx * 2]) arrowsByTract[subIdx * 2].classList.add("on");
              if (arrowsByTract[subIdx * 2 + 1]) arrowsByTract[subIdx * 2 + 1].classList.add("on");
            }
            if (sIdx === 0) {
              const loc = (T.find(x => x.id === it.id)?.loc[round.lv] || [])[subIdx];
              if (loc) {
                svg.insertAdjacentHTML("beforeend", `<text class="quiz-node-pin" data-pin-uid="${it.uid}" x="${100 + loc[0]}" y="${loc[1] + 2.5}">${pinNum}</text>`);
              }
            }
          });
        }
      });

      svg.addEventListener("click", e => {
        const node = e.target.closest(".quiz-label-node");
        if (!node) return;
        const uid = node.dataset.nodeUid;
        if (!uid || quizState.matchedUids.has(uid)) return;
        quizState.selectedNodeUid = uid;
        svg.querySelectorAll(".quiz-label-node").forEach(n => n.classList.toggle("selected-node", n.dataset.nodeUid === uid));
        if (quizState.selectedBankUid) {
          tryLabelMatch(quizState.selectedBankUid, quizState.selectedNodeUid, round);
        }
      });
    }

    $("#quiz-label-bank")?.addEventListener("click", e => {
      const pill = e.target.closest(".bank-pill");
      if (!pill) return;
      const uid = pill.dataset.bankUid;
      if (!uid || quizState.matchedUids.has(uid)) return;
      quizState.selectedBankUid = uid;
      $("#quiz-label-bank").querySelectorAll(".bank-pill").forEach(p => p.classList.toggle("selected-pill", p.dataset.bankUid === uid));
      if (quizState.selectedNodeUid) {
        tryLabelMatch(quizState.selectedBankUid, quizState.selectedNodeUid, round);
      }
    });

    $("#quiz-reconfig-btn")?.addEventListener("click", openQuizModal);
    $("#quiz-exit-btn")?.addEventListener("click", exitQuizMode);
  }

  function tryLabelMatch(bankUid, nodeUid, round) {
    const svg = $("#quiz-svg");
    const bankEl = $("#quiz-label-bank");
    const item = round.items.find(x => x.uid === nodeUid);

    if (bankUid === nodeUid) {
      // Correct match!
      quizState.matchedUids.add(nodeUid);
      const firstTry = !quizState.missedUids.has(nodeUid);
      if (firstTry) quizState.score++;
      quizState.history.push({
        item,
        isCorrect: firstTry,
        userAnswerText: firstTry ? "Matched on 1st try" : "Matched after retry"
      });

      quizState.selectedBankUid = null;
      quizState.selectedNodeUid = null;

      bankEl?.querySelectorAll(".bank-pill").forEach(p => {
        p.classList.remove("selected-pill");
        if (p.dataset.bankUid === nodeUid) {
          p.classList.add("matched-pill");
          p.disabled = true;
        }
      });

      svg?.querySelectorAll(".quiz-label-node").forEach(n => {
        n.classList.remove("selected-node");
        if (n.dataset.nodeUid === nodeUid) n.classList.add("matched-node");
      });

      const pin = svg?.querySelector(`[data-pin-uid="${nodeUid}"]`);
      if (pin) pin.textContent = "✓";

      const scorePill = $("#label-score-pill");
      if (scorePill) scorePill.textContent = `Score: ${quizState.score} / ${quizState.totalPossible}`;

      // Check if all items on this slice are now matched
      if (quizState.matchedUids.size >= round.items.length) {
        const isLast = quizState.idx + 1 >= quizState.rounds.length;
        const slot = $("#quiz-feedback-slot");
        if (slot) {
          slot.innerHTML = `
            <div class="quiz-feedback ok">
              <strong>✓ Slice Complete!</strong>
              <div>All ${round.items.length} structures on ${round.sliceTitle.split(":")[0]} have been labeled.</div>
            </div>
            <div style="display:flex;justify-content:flex-end;margin-top:10px">
              <button type="button" class="primary-btn" id="quiz-next-btn">${isLast ? "View Final Score →" : "Next Slice →"}</button>
            </div>
          `;
          $("#quiz-next-btn")?.addEventListener("click", () => {
            quizState.idx++;
            renderLabelRound();
          });
        }
      }
    } else {
      // Mismatch! Record miss for both and flash red briefly
      quizState.missedUids.add(nodeUid);
      quizState.missedUids.add(bankUid);
      quizState.selectedBankUid = null;
      quizState.selectedNodeUid = null;

      const wrongPill = bankEl?.querySelector(`[data-bank-uid="${bankUid}"]`);
      const wrongNodes = svg?.querySelectorAll(`[data-node-uid="${nodeUid}"]`);
      bankEl?.querySelectorAll(".bank-pill").forEach(p => p.classList.remove("selected-pill"));
      svg?.querySelectorAll(".quiz-label-node").forEach(n => n.classList.remove("selected-node"));

      wrongPill?.classList.add("wrong-flash");
      wrongNodes?.forEach(n => n.classList.add("wrong-flash"));
      setTimeout(() => {
        wrongPill?.classList.remove("wrong-flash");
        wrongNodes?.forEach(n => n.classList.remove("wrong-flash"));
      }, 650);
    }
  }

  // --- Render End-of-Quiz Final Score & Review Screen ---
  function renderQuizSummary() {
    const total = Math.max(1, quizState.totalPossible);
    const pct = Math.round((quizState.score / total) * 100);
    const rank = pct >= 90
      ? "🏆 Chief of Neuroanatomy!"
      : pct >= 75
      ? "🌟 Senior Neurology Resident"
      : pct >= 60
      ? "📘 Solid Clinical Localization"
      : "🔬 Keep Practicing the Pathways!";

    quizStage.innerHTML = `
      <div class="quiz-topbar">
        <div class="quiz-meta">
          <span class="quiz-badge">🎓 Quiz Complete</span>
          <strong>Final Results</strong>
        </div>
        <button type="button" class="mini-btn" id="quiz-exit-btn">Return to Atlas</button>
      </div>

      <div class="quiz-summary">
        <div class="score-hero">
          <div>
            <div class="score-big">${quizState.score} / ${quizState.totalPossible} (${pct}%)</div>
            <div style="font-size:14px;font-weight:700;margin-top:2px">${rank}</div>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            <button type="button" class="mini-btn" id="quiz-change-settings-btn">⚙ Change Settings</button>
            <button type="button" class="primary-btn" id="quiz-retry-btn">↻ Play Again</button>
          </div>
        </div>

        <h3 style="margin:4px 0 0;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;color:var(--mut)">Question Breakdown (Click any item to inspect in Atlas)</h3>
        <div class="score-review-list">
          ${quizState.history.map(h => `
            <div class="review-item ${h.isCorrect ? "rev-ok" : "rev-err"}">
              <div>
                <strong>${h.isCorrect ? "✓" : "✕"} ${h.item.displayName}</strong>
                <div style="font-size:11px;color:var(--mut)">${h.item.sliceTitle.split(":")[0]} · Your answer: ${h.userAnswerText}</div>
              </div>
              <button type="button" class="mini-btn" data-inspect-id="${h.item.id}" data-inspect-lv="${h.item.lv}">Inspect</button>
            </div>
          `).join("")}
        </div>
      </div>
    `;

    $("#quiz-exit-btn")?.addEventListener("click", exitQuizMode);
    $("#quiz-change-settings-btn")?.addEventListener("click", openQuizModal);
    $("#quiz-retry-btn")?.addEventListener("click", launchQuizSession);

    quizStage.querySelectorAll("[data-inspect-id]").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.inspectId;
        const lv = btn.dataset.inspectLv;
        exitQuizMode();
        sel = null;
        selectItem(id);
        if (lv) jumpToSlice(lv);
      });
    });
  }

  function exitQuizMode() {
    quizState = null;
    document.body.classList.remove("quiz-active");
    quizStage.classList.add("hidden");
    quizStage.innerHTML = "";
    paint();
  }
})();
try {
  brain3d = initBrain3D({
    canvas: $("#brain3d-canvas"),
    onSelectSlice: sliceKey => jumpToSlice(sliceKey)
  });
} catch (err) {
  console.warn("3D Brain initialization fallback:", err);
}

new ResizeObserver(layout).observe($("#dsv-wrap"));
renderSidebar();
layout();
paint();
