import { initBrain3D } from './brain3d.js';

const Y = { cx: 26, olf: 52, bg: 70, th: 104, mb: 160, po: 216, rm: 272, mm: 318, cm: 362, cd: 420, cs: 486, cb: 240 };
// Columns of the 2D schematic: L(eft, ipsilateral) and R(ight, contralateral) either side of the midline (MID),
// O(utside) for cranial nerve exits and E for the cerebellum. The left margin (up to x = 66) holds the level names.
const X = { L: 115, R: 191, E: 239, O: 73 };
const MID = 153, DSV_W = 264, DSV_TOP = 16;

const T = [
  { id: "dc", n: "Dorsal column (gracilis & cuneatus)", d: "a", p: "L:cs L:cd L:cm L:mm", loc: {},
    o: "Large-diameter primary afferents (cell bodies in dorsal root ganglia). Gracilis: below T6 (leg); cuneatus: T6 and above (arm).", c: "Ascend ipsilaterally in the dorsal funiculus with no synapse in the cord.", x: "None at this stage (second-order fibres cross in the medulla).", t: "Nucleus gracilis and nucleus cuneatus, caudal/mid medulla.", f: "Fine touch, vibration, conscious proprioception, two-point discrimination.", l: "Ipsilateral loss below the lesion, positive Romberg, sensory ataxia (tabes dorsalis, B12 deficiency)." },
  { id: "ast", n: "Anterior spinothalamic", d: "a", p: "L:cs R:cs R:cd R:cm R:mm R:rm R:po R:mb R:th R:cx", loc: { c: [[36, 158, 6, 9]] },
    o: "Second-order neurons in dorsal horn (laminae I, V–VII) after Aδ/C afferent input.", c: "Ascends in the anterior funiculus; becomes part of the spinal lemniscus in the brainstem.", x: "Anterior white commissure, 1–2 segments above entry.", t: "VPL thalamus, then S1 (also reticular formation).", f: "Crude touch and pressure.", l: "Contralateral mild loss of crude touch; usually masked by intact dorsal columns." },
  { id: "lst", n: "Lateral spinothalamic", d: "a", p: "L:cs R:cs R:cd R:cm R:mm R:rm R:po R:mb R:th R:cx", loc: { c: [[68, 140, 7, 10]] },
    o: "Dorsal horn laminae I, V (second order) after Aδ/C pain and temperature afferents.", c: "Ascends in the lateral funiculus (somatotopic: sacral lateral, cervical medial).", x: "Anterior white commissure, 1–2 segments above entry.", t: "VPL thalamus (via spinal lemniscus), then S1/insula/cingulate.", f: "Sharp pain and temperature.", l: "Contralateral pain/temperature loss starting 1–2 segments below the lesion. Syringomyelia: cape-like bilateral loss. Brown-Séquard: contralateral loss, ipsilateral weakness and dorsal-column loss." },
  { id: "dsc", n: "Dorsal spinocerebellar", d: "a", p: "L:cd L:cm L:mm E:cb", loc: {},
    o: "Clarke’s nucleus (C8–L3) receiving muscle spindle / Golgi tendon afferents from leg and trunk.", c: "Ipsilateral dorsolateral funiculus, then the inferior cerebellar peduncle.", x: "None (uncrossed).", t: "Ipsilateral cerebellar vermis/paravermis (spinocerebellum).", f: "Unconscious proprioception for coordination.", l: "Ipsilateral limb ataxia (Friedreich ataxia)." },
  { id: "vsc", n: "Ventral spinocerebellar", d: "a", p: "L:cs R:cs R:cd R:cm R:mm R:rm R:po E:cb", loc: {},
    o: "Spinal border cells, lumbosacral cord.", c: "Cross, ascend the ventrolateral cord and brainstem, enter via the superior cerebellar peduncle.", x: "Double crossing: in the cord, and again in the cerebellum.", t: "Ipsilateral cerebellar cortex (net uncrossed).", f: "Unconscious feedback of whole-limb motor activity.", l: "Ipsilateral lower-limb ataxia." },
  { id: "cun", n: "Cuneocerebellar", d: "a", p: "L:cd L:cm L:mm E:cb", loc: {},
    o: "Accessory (external) cuneate nucleus, relaying upper-limb and neck proprioceptors via the cuneate fasciculus.", c: "External arcuate fibres, then the inferior cerebellar peduncle.", x: "None.", t: "Ipsilateral cerebellar vermis/paravermis.", f: "Upper-limb equivalent of the dorsal spinocerebellar tract.", l: "Ipsilateral arm ataxia." },
  { id: "ml", n: "Medial lemniscus", d: "a", p: "L:mm R:mm R:rm R:po R:mb R:th R:cx", loc: {},
    o: "Nucleus gracilis and cuneatus.", c: "Internal arcuate fibres sweep ventromedially, then ascend by the midline (vertical in medulla, lateral and flat in pons/midbrain), then the internal capsule.", x: "Sensory (lemniscal) decussation in mid medulla.", t: "VPL thalamus, then S1.", f: "Fine touch, vibration, proprioception.", l: "Contralateral loss of vibration/position sense. Medial medullary syndrome: contralateral ML loss + hemiparesis, ipsilateral tongue weakness (anterior spinal artery)." },
  { id: "sl", n: "Spinal lemniscus (spinothalamic in brainstem)", d: "a", p: "L:cs R:cs R:cd R:cm R:mm R:rm R:po R:mb R:th R:cx", loc: {},
    o: "Contralateral dorsal horn (spinothalamic, spinoreticular, spinotectal fibres).", c: "Anterolateral medulla, then dorsolateral pons, then lateral midbrain.", x: "Already crossed in the cord.", t: "VPL, intralaminar thalamus, reticular formation, tectum.", f: "Pain, temperature, crude touch.", l: "Lateral medullary (Wallenberg, PICA): contralateral body pain/temperature loss." },
  { id: "tl", n: "Trigeminal lemniscus", d: "a", p: "L:rm R:rm R:po R:mb R:th R:cx", loc: {},
    o: "Spinal trigeminal nucleus (pain/temperature) and principal sensory nucleus (touch) of CN V.", c: "Ventral trigeminothalamic fibres cross and join the medial lemniscus, then ascend dorsomedially.", x: "Crosses in medulla/pons (small dorsal tract is uncrossed).", t: "VPM thalamus, then S1 face area.", f: "Face and oral cavity sensation.", l: "Wallenberg: ipsilateral face pain/temperature loss (spinal V) with contralateral body loss." },
  { id: "ll", n: "Lateral lemniscus", d: "a", p: "L:po R:po R:mb R:th R:cx", loc: {},
    o: "Cochlear nuclei and superior olivary complex (pons).", c: "Via trapezoid body, ascends lateral pontine tegmentum to the inferior colliculus.", x: "Most fibres cross in the trapezoid body; bilateral representation.", t: "Inferior colliculus, then MGB, then auditory cortex (Heschl’s gyrus).", f: "Hearing and sound localisation.", l: "Central unilateral lesions give subtle bilateral hearing and localisation deficits, not unilateral deafness." },
  { id: "cb", n: "Corticobulbar", d: "d", p: "R:cx R:mb R:po R:rm", loc: {},
    o: "Motor and premotor cortex (face area), lateral precentral gyrus.", c: "Corona radiata, genu of internal capsule, medial cerebral peduncle, pons, medulla.", x: "Mostly bilateral, with branches crossing at each cranial nerve nucleus.", t: "Motor nuclei of CN V, VII, IX–XII via reticular formation.", f: "Voluntary control of face, jaw, tongue, pharynx.", l: "UMN facial palsy: contralateral lower face weak, forehead spared. Tongue deviates away from a cortical lesion. Bilateral lesions: pseudobulbar palsy." },
  { id: "lcst", n: "Lateral corticospinal", d: "d", p: "R:cx R:mb R:po R:rm R:mm R:cm L:cm L:cd L:cs", loc: {},
    o: "M1 (about 30%), premotor/SMA and S1.", c: "Corona radiata, posterior limb of internal capsule, mid cerebral peduncle, basis pontis, medullary pyramid, lateral funiculus.", x: "Pyramidal decussation in caudal medulla (about 90%).", t: "Lateral ventral horn: α-motor neurons of distal limb muscles.", f: "Voluntary fine, skilled distal movements.", l: "Capsular stroke: contralateral spastic hemiparesis. Spinal lesion: ipsilateral spasticity, hyperreflexia, Babinski below the level." },
  { id: "acst", n: "Anterior corticospinal", d: "d", p: "R:cx R:mb R:po R:rm R:mm R:cm R:cd L:cd", loc: {},
    o: "M1 and premotor cortex (about 10% of fibres).", c: "Same route to the pyramid, then stays uncrossed in the anterior funiculus down to the thoracic cord.", x: "Crosses at the segmental level in the anterior white commissure.", t: "Medial motor neurons for axial and proximal muscles (bilateral).", f: "Posture and axial/trunk movement.", l: "Rarely isolated; bilateral axial weakness." },
  { id: "vst", n: "Vestibulospinal (lateral)", d: "d", p: "L:po L:rm L:mm L:cm L:cd L:cs", loc: {},
    o: "Lateral vestibular (Deiters) nucleus, pons/medulla.", c: "Ipsilateral anterior funiculus to sacral cord.", x: "None.", t: "Medial ventral horn: extensor (antigravity) motor neurons.", f: "Posture and balance; facilitates extensors.", l: "Loss of facilitation: reduced extensor tone. Cerebellar lesions disinhibit it." },
  { id: "prst", n: "Pontine (medial) reticulospinal", d: "d", p: "L:po L:rm L:mm L:cm L:cd L:cs", loc: {},
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
  { id: "tect", n: "Tectospinal", d: "d", p: "L:mb R:mb R:po R:rm R:mm R:cm R:cd", loc: { rmb: [[26, 40, 10, 6], [6, 90, 8, 3]], cmb: [[3, 90, 5, 4]], rp: [[8, 96, 4, 5]], cp: [[7, 74, 4, 5]], rm: [[9, 90, 4, 6]], mm: [[8, 94, 4, 6]], cm: [[11, 98, 4, 6]], c: [[24, 156, 4, 6]] } },
  // Kept last so adding it does not shift the colours of the items above (colour comes from list position)
  { id: "ctt", n: "Central tegmental tract", d: "d", p: "L:mb L:po L:rm", loc: {} }
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
  mrst: ["Medullary reticular formation (nucleus gigantocellularis).", "Descends bilaterally, mainly ipsilaterally, in the ventrolateral funiculus.", "Does not cross (bilateral, mostly ipsilateral).", "Terminates on interneurons that inhibit extensors and facilitate flexors, and on autonomic and respiratory circuits.", "Controls inhibition of extensor tone and modulates spinal reflexes, gait and autonomic activity.", "Lesion: a lesion above the red nucleus removes inhibitory cortical drive to it; the intact rubrospinal tract then produces decorticate posturing."],
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
  ctt: ["Parvocellular red nucleus and the surrounding midbrain tegmentum (descending fibres); the solitary nucleus and reticular formation give rise to its ascending fibres.", "Descends through the central tegmentum of the midbrain and pons, dorsal to the medial lemniscus, and spreads over the surface of the inferior olive as the amiculum.", "Does not cross (ipsilateral); the olive's own output then crosses to the opposite cerebellum.", "Terminates in the inferior olivary nucleus on the same side; ascending fibres reach the thalamus (taste to VPM, reticular input to the intralaminar nuclei).", "Carries red nucleus and midbrain input to the inferior olive, closing the Guillain-Mollaret triangle (dentate nucleus, red nucleus, inferior olive) used in motor learning; also carries taste and arousal fibres upward.", "Lesion: palatal tremor (rhythmic 1–3 Hz palatal myoclonus, sometimes with eye or limb tremor) developing weeks to months later, with hypertrophic olivary degeneration on the same side (an enlarged, T2-bright olive on MRI). Typical causes are pontine haemorrhage or infarction, trauma and demyelination."],
  tect: ["Deep layers of the superior colliculus (rostral midbrain), integrating retinal, frontal eye field and auditory input.", "Fibres arc ventrally around the periaqueductal gray, cross, then descend beside the MLF through the brainstem and in the anterior funiculus of the cervical cord.", "Crosses in the dorsal tegmental decussation of the midbrain.", "Terminates in cervical cord interneurons (C1 to C4, laminae VI to VIII) and brainstem gaze centres.", "Controls reflex turning of the head and neck toward visual and auditory stimuli (orienting reflex).", "Lesion: rarely isolated; superior colliculus damage impairs visual orienting. Dorsal midbrain lesions (pineal tumour, hydrocephalus) cause Parinaud syndrome (upgaze palsy, light-near dissociation) through adjacent structures."]
};

T.forEach(t => {
  const a = TX[t.id];
  if (a) Object.assign(t, { o: a[0], c: a[1], x: a[2], t: a[3], f: a[4], l: a[5] });
});

// Refined cross-section coordinates [dx, y, rx, ry, label]
const R_COORDS = {
  dc: { lum: [[11, 60, 9, 15]], c: [[7, 50, 6, 12], [22, 52, 9, 11]], cm: [[10, 44, 6, 12], [26, 48, 8, 11]], mm: [[12, 42, 8, 12], [30, 48, 10, 11]] },
  lcst: { lum: [[60, 84, 9, 11]], c: [[68, 76, 12, 14]], cm: [[14, 122, 11, 16], [56, 88, 9, 12]], mm: [[22, 158, 17, 12]], rm: [[26, 158, 16, 11]], cp: [[24, 140, 13, 9], [46, 146, 10, 8]], rp: [[24, 140, 13, 9], [46, 146, 10, 8]], cmb: [[62, 148, 12, 14]], rmb: [[68, 142, 10, 16]] },
  acst: { c: [[12, 154, 9, 9]], cm: [[6, 150, 6, 8]], cp: [[10, 146, 5, 6]], rp: [[8, 148, 4, 6]] },
  cb: { rm: [[30, 144, 6, 5]], cp: [[16, 130, 5, 5]], rp: [[16, 132, 5, 5]], cmb: [[46, 152, 4, 12]], rmb: [[56, 148, 4, 12]] },
  dsc: { c: [[84, 98, 5, 14]], cm: [[74, 98, 5, 12]], mm: [[72, 104, 5, 10]], rm: [[72, 56, 8, 13]], cp: [[46, 58, 9, 10]] },
  vsc: { lum: [[71, 114, 3, 7]], c: [[78, 126, 6, 10]], cm: [[72, 124, 5, 10]], mm: [[68, 124, 5, 9]], rm: [[72, 136, 4, 7]], rp: [[30, 46, 5, 9]] },
  cun: { mm: [[42, 68, 7, 7]], rm: [[78, 64, 4, 6]] },
  lst: { lum: [[64, 130, 4.5, 7]], c: [[66, 126, 6, 10]] },
  ast: { lum: [[34, 154, 5, 3.5]], c: [[44, 152, 6, 7]] },
  sl: { cm: [[60, 126, 7, 10]], mm: [[54, 136, 8, 10]], rm: [[72, 122, 7, 9]], cp: [[50, 98, 6, 8]], rp: [[46, 122, 6, 7]], cmb: [[62, 80, 6, 8]], rmb: [[56, 88, 7, 6]] },
  ml: { mm: [[8, 120, 6, 20], [22, 86, 14, 4]], rm: [[8.5, 114, 6, 24]], cp: [[18, 96, 16, 6]], rp: [[26, 114, 16, 6]], cmb: [[56, 100, 13, 9]], rmb: [[52, 104, 10, 7]] },
  tl: { mm: [[18, 96, 4, 5]], rm: [[22, 100, 5, 6]], cp: [[8, 82, 5, 5]], rp: [[12, 104, 5, 5]], cmb: [[42, 84, 4, 6]], rmb: [[46, 114, 4, 5]] },
  ll: { cp: [[33, 84, 5, 6]], rp: [[40, 108, 5, 6]], cmb: [[58, 58, 5, 8]], rmb: [[62, 64, 8, 10]] },
  mlf: { cm: [[5, 96, 3, 8]], mm: [[4, 80, 3, 9]], rm: [[4, 76, 3, 9]], cp: [[5, 60, 3, 8]], rp: [[4, 82, 3, 8]], cmb: [[7, 82, 3, 5]], rmb: [[7, 80, 3, 6]] },
  vst: { lum: [[18, 152, 5, 4]], c: [[60, 142, 8, 8]], cm: [[44, 108, 5, 7]], mm: [[44, 110, 5, 7]], rm: [[36, 84, 5, 6]], cp: [[38, 60, 3, 4]] },
  mrst: { lum: [[48, 150, 5, 4]], c: [[38, 134, 7, 8]], cm: [[34, 112, 6, 8]], mm: [[26, 108, 7, 8]], rm: [[28, 98, 7, 8]] },
  prst: { lum: [[7, 136, 3.5, 7]], c: [[26, 142, 5, 8]], cm: [[28, 100, 5, 7]], mm: [[24, 128, 5, 7]], rm: [[34, 112, 5, 7]], cp: [[20, 70, 5, 8]], rp: [[16, 92, 6, 8]] },
  rub: { lum: [[65, 102, 4, 5]], c: [[74, 110, 7, 9]], cm: [[64, 106, 6, 7]], mm: [[50, 96, 5, 7]], rm: [[62, 104, 5, 7]], cp: [[38, 100, 4, 5]], rp: [[52, 100, 5, 6]], cmb: [[34, 132, 10, 5]], rmb: [[30, 106, 12, 12], [8, 146, 12, 4]] },
  olcb: { rm: [[46, 132, 15, 13]] },
  // Central tegmental tract: dorsal to the red nucleus, then the central tegmentum dorsal to the medial lemniscus,
  // ending as the amiculum on the dorsal surface of the inferior olive (custom crescent on rm)
  ctt: { rmb: [[33, 84, 4, 4]], cmb: [[26, 86, 4, 5]], rp: [[28, 94, 4, 5]], cp: [[20, 82, 3.5, 4.5]], rm: [[46, 115, 16, 4]] },
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
  ctt: { rm: ["Amiculum of the olive"] },
  dc: { lum: ["Fasciculus gracilis"], c: ["Fasciculus gracilis", "Fasciculus cuneatus"], cm: ["Fasciculus gracilis", "Fasciculus cuneatus"], mm: ["Nucleus gracilis", "Nucleus cuneatus"] },
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
  PFC: ["Prefrontal cortex", "Frontal cortex in front of the premotor areas, with dorsolateral (BA 9/46), orbitofrontal and ventromedial parts. Reciprocally connected with the mediodorsal (MD) thalamus and the head of the caudate (the associative and limbic basal ganglia loops); frontopontine fibres run in the medial cerebral peduncle. Supports executive function: planning, working memory, attention, inhibiting inappropriate responses and social behaviour. Supplied by the ACA (medial and orbital surfaces) and MCA (lateral convexity). Lesions: dorsolateral damage causes poor planning, perseveration and apathy (abulia); orbitofrontal damage causes disinhibition and impulsivity; frontal release signs such as the grasp reflex may appear."],
  BRO: ["Broca area (BA 44/45)", "Pars opercularis and pars triangularis of the dominant (usually left) inferior frontal gyrus, just in front of the face area of the motor cortex. Linked to Wernicke area by the arcuate fasciculus. Plans the motor programme for speech and handles grammar. Supplied by the superior division of the MCA. Lesion: non-fluent (expressive) aphasia: slow, effortful, telegraphic speech with poor repetition and naming but largely preserved comprehension; the patient is aware of the deficit and frustrated. Often accompanied by weakness of the opposite face and arm because M1 is next door."],
  PM: ["Premotor / supplementary motor cortex", "Lateral premotor cortex and medial supplementary motor area (SMA), both BA 6, in front of M1; the frontal eye field (BA 8) lies just ahead. Receives VA and VL thalamus (basal ganglia and cerebellar loops) and parietal input, and contributes corticospinal and corticoreticular fibres. Plans and sequences movement: premotor cortex for externally guided movement, SMA for self-initiated sequences and two-handed coordination; the frontal eye field drives voluntary saccades to the opposite side. Lesions: apraxia and difficulty sequencing; SMA lesions reduce spontaneous movement and speech and can cause alien hand; a frontal eye field lesion deviates the eyes toward the lesion."],
  M1: ["Primary motor cortex (M1, BA 4)", "Precentral gyrus, with the motor homunculus: face lowest (near the Sylvian fissure), then hand and arm, with the trunk and leg at the top and on the medial surface (paracentral lobule). Layer V pyramidal cells, including giant Betz cells, give rise to the corticospinal and corticobulbar tracts, which pass through the posterior limb and genu of the internal capsule. Receives VL thalamus (cerebellar output), premotor cortex and S1. Encodes the force and direction of voluntary movement, especially fine distal movement. Lesion: contralateral UMN weakness with spasticity and hyperreflexia after an initial flaccid phase, following the homunculus (MCA strokes hit the face and arm, ACA strokes the leg). Jacksonian seizures march along it."],
  S1: ["Primary somatosensory cortex (S1, BA 3,1,2)", "Postcentral gyrus, with a sensory homunculus matching M1. Receives VPL (body) and VPM (face) through the posterior limb of the internal capsule. Area 3b handles discriminative touch, 3a proprioception, area 1 texture and area 2 size and shape; output goes to secondary somatosensory cortex, posterior parietal cortex and M1. Lesion: contralateral loss of discriminative (cortical) sensation: two-point discrimination, stereognosis, graphaesthesia and position sense, with pain and temperature relatively preserved; extinction to double simultaneous stimulation."],
  PAR: ["Parietal association cortex", "Superior parietal lobule (BA 5/7) and inferior parietal lobule (supramarginal gyrus BA 40, angular gyrus BA 39) behind S1. Combines touch, vision and hearing into a map of the body and surrounding space; part of the dorsal (“where/how”) visual stream and reciprocally linked with the pulvinar. Dominant lesions: Gerstmann syndrome (agraphia, acalculia, finger agnosia, left-right confusion), ideomotor apraxia, alexia with agraphia (angular gyrus) and conduction aphasia (supramarginal gyrus and arcuate fasciculus). Non-dominant lesions: hemispatial neglect, anosognosia, constructional and dressing apraxia. Bilateral lesions: Balint syndrome."],
  V1: ["Primary visual cortex (BA 17)", "Striate cortex on the banks of the calcarine sulcus, medial occipital lobe. Receives the optic radiation from the LGN: the upper bank (cuneus) represents the lower visual field, the lower bank (lingual gyrus) the upper field, and the macula lies at the occipital pole. Organised in ocular dominance and orientation columns; output goes to V2 and on into the ventral (“what”, temporal) and dorsal (“where”, parietal) streams. Supplied by the PCA (calcarine branch), the pole often also by the MCA. Lesion: contralateral homonymous hemianopia, often with macular sparing; bilateral lesions cause cortical blindness with normal pupillary reflexes (Anton syndrome when the blindness is denied)."],
  A1: ["Primary auditory cortex (BA 41/42)", "Transverse temporal (Heschl) gyri on the upper surface of the temporal lobe, inside the Sylvian fissure. Tonotopic: low frequencies anterolateral, high frequencies posteromedial. Receives the MGN through the auditory radiation (sublenticular part of the internal capsule); each side hears both ears, so a unilateral lesion rarely causes deafness. The surrounding belt cortex, including Wernicke area, analyses complex sounds and speech. Lesion: poor sound localisation and discrimination; bilateral lesions cause cortical deafness, and lesions that cut A1 off from Wernicke area cause pure word deafness."],
  WER: ["Wernicke area (BA 22)", "Posterior part of the dominant superior temporal gyrus, behind A1, extending toward the supramarginal and angular gyri. Maps speech sounds to word meanings; connected to Broca area by the arcuate fasciculus. Supplied by the inferior division of the MCA. Lesion: fluent (receptive) aphasia: normal rate and melody but empty speech with paraphasias and neologisms, poor comprehension and repetition, and often little awareness of the deficit; may come with a contralateral upper quadrantanopia (Meyer loop) and no weakness. Damage to the arcuate fasciculus alone causes conduction aphasia (poor repetition with good comprehension)."],
  OLF: ["Primary olfactory (piriform) cortex", "Piriform cortex at the junction of the frontal and temporal lobes near the uncus, with the periamygdaloid and entorhinal cortex. Receives the lateral olfactory stria directly from the mitral and tufted cells of the olfactory bulb: smell is the only sense that reaches cortex without a thalamic relay (an indirect route through MD reaches orbitofrontal cortex). Close links with the amygdala and hippocampus tie smell to emotion and memory. Lesion: unilateral loss is rarely noticed; uncal seizures cause olfactory auras (unpleasant smells). Loss of smell is an early sign of Parkinson and Alzheimer disease."],
  ANT: ["Anterior nucleus of thalamus", "Anterior nuclear group in the rostral thalamus, under the anterior tubercle, enclosed by the split internal medullary lamina. Receives the mammillothalamic tract from the mammillary bodies (and fornix fibres from the hippocampus) and projects to the cingulate gyrus, as part of the Papez circuit. Involved in episodic memory and spatial navigation. Supplied by the tuberothalamic (polar) artery from the posterior communicating artery. Lesion: anterograde amnesia, as in anterior thalamic infarcts and Wernicke-Korsakoff syndrome; a deep brain stimulation target in refractory epilepsy."],
  VA: ["Ventral anterior nucleus (VA)", "Front part of the ventral tier of the thalamus. Receives inhibitory (GABAergic) output from GPi and substantia nigra pars reticulata, and projects to premotor, supplementary motor and prefrontal cortex as well as diffusely to frontal cortex. Part of the basal ganglia-thalamo-cortical loop that selects and initiates movement and behaviour. Lesion: rarely isolated; with anterior thalamic infarcts it contributes to apathy, reduced initiation and language disturbance (thalamic aphasia) on the dominant side."],
  VL: ["Ventral lateral nucleus (VL)", "Ventral tier behind VA. Its posterior part (VLp, including Vim) receives the opposite dentate and interposed nuclei through the superior cerebellar peduncle; its anterior part (VLa) receives GPi. Projects to M1 and premotor cortex, carrying cerebellar and basal ganglia output to motor cortex. Lesion: contralateral ataxia (often with sensory loss when VPL is also hit: hemiataxia-hypaesthesia). Vim is the target for deep brain stimulation, thalamotomy or focused ultrasound in essential and parkinsonian tremor."],
  MD: ["Mediodorsal nucleus (MD)", "Large medial nucleus between the internal medullary lamina and the third ventricle. Reciprocally connected with prefrontal (dorsolateral and orbitofrontal) cortex, and receives the amygdala, ventral pallidum and olfactory cortex. Supports working memory, executive function, emotion and motivation. Supplied by paramedian thalamic arteries from the PCA (P1). Lesions: memory loss and apathy; damaged together with the mammillary bodies in Korsakoff syndrome (amnesia, confabulation); bilateral paramedian infarcts (artery of Percheron) cause hypersomnolence and amnesia, with vertical gaze palsy if the midbrain is involved."],
  IL: ["Intralaminar nuclei (CM/Pf)", "Nuclei within the internal medullary lamina, the largest being the centromedian (CM) and parafascicular (Pf) nuclei. Receive the reticular formation, spinothalamic (pain) collaterals, GPi and cerebellum; project diffusely to cortex and heavily to the striatum. Part of the ascending arousal system, important for attention and for the alerting, unpleasant side of pain. Lesion: bilateral damage (paramedian thalamic infarcts) reduces consciousness, from hypersomnolence to coma. CM-Pf is a deep brain stimulation target in Tourette syndrome and some pain disorders."],
  VPL: ["Ventral posterolateral nucleus (VPL)", "Body sensory relay in the caudal ventral tier. Receives the medial lemniscus (fine touch, vibration, proprioception) and spinothalamic tract (pain, temperature) from the opposite body, arranged with the leg lateral and the arm medial. Projects through the posterior limb of the internal capsule to S1. Supplied by the thalamogeniculate branches of the PCA. Lesion: contralateral loss of all sensory modalities over the body (pure sensory stroke, usually with VPM); weeks later, burning pain and allodynia can develop (Dejerine-Roussy thalamic pain syndrome)."],
  VPM: ["Ventral posteromedial nucleus (VPM)", "Medial to VPL in the caudal ventral tier. Receives the trigeminal lemniscus (touch, pain and temperature from the opposite face and mouth) and, in its small-celled part, taste fibres from the solitary nucleus. Projects to the face area of S1 and to the insular taste cortex. Supplied by the thalamogeniculate branches of the PCA. Lesion: contralateral facial and intraoral sensory loss; together with VPL a small infarct gives a pure sensory stroke of face, arm and leg that splits exactly at the midline, sometimes only around the mouth and hand (cheiro-oral pattern)."],
  PUL: ["Pulvinar", "Large posterior part of the thalamus, overhanging the midbrain. Receives the superior colliculus and visual cortex, and is reciprocally connected with parietal, temporal and occipital association cortex. Directs visual attention, filters out distractors and links eye movements with what is being looked at. Supplied by the posterior choroidal arteries. Lesion: contralateral visual neglect or inattention, and thalamic aphasia on the dominant side. Bilateral pulvinar T2 signal on MRI (pulvinar sign) suggests variant Creutzfeldt-Jakob disease."],
  LGN: ["Lateral geniculate nucleus (LGN)", "Six-layered nucleus on the underside of the posterior thalamus. Receives the optic tract: layers 1, 4 and 6 from the opposite eye (crossed nasal fibres), layers 2, 3 and 5 from the same eye; layers 1 and 2 are magnocellular (motion), 3 to 6 parvocellular (detail and colour), with koniocellular cells between. Projects through the optic radiation (Meyer loop in the temporal lobe, the upper fibres through the parietal lobe) to V1. Supplied by the anterior choroidal artery and the PCA. Lesion: contralateral homonymous field defect, sometimes wedge-shaped (sectoranopia) because of the dual blood supply. Pupillary light fibres leave the tract before the LGN, so the pupils are normal."],
  MGN: ["Medial geniculate nucleus (MGN)", "Nucleus on the posterior thalamus beneath the pulvinar. Receives the inferior colliculus through the brachium of the inferior colliculus; its ventral division is tonotopic. Projects through the auditory radiation (sublenticular part of the internal capsule) to A1 in Heschl gyrus, and its other divisions reach the amygdala and association cortex. Lesion: because the auditory pathway is bilateral above the cochlear nuclei, damage on one side causes little hearing loss; bilateral lesions can cause cortical-type deafness or auditory agnosia."],
  CAU: ["Caudate nucleus", "C-shaped nucleus: the head bulges into the lateral wall of the frontal horn, the body runs along the lateral ventricle and the tail curves into the temporal lobe toward the amygdala. With the putamen it forms the striatum, the input station of the basal ganglia; it receives mainly prefrontal and association cortex plus dopamine from SNc, and drives the associative (cognitive) and oculomotor loops. Supplied by the recurrent artery of Heubner (head) and the lateral lenticulostriate arteries. Lesions: head-of-caudate infarcts cause abulia, apathy and disinhibition. Atrophy of the caudate head, with enlarged frontal horns (“box-car” ventricles), is the hallmark of Huntington disease (chorea, dementia, psychiatric change)."],
  PUT: ["Putamen", "Lateral part of the lentiform nucleus, deep to the insula and separated from the globus pallidus by the external medullary lamina. With the caudate it forms the striatum; it receives mainly sensorimotor cortex and dopamine from SNc, and is the input station of the motor loop. Its GABAergic medium spiny neurons form the direct (D1, to GPi) and indirect (D2, to GPe) pathways. Supplied by the lenticulostriate arteries of the MCA, and the commonest site of hypertensive intracerebral haemorrhage. Lesions: dopamine loss here produces the signs of Parkinson disease; focal infarcts can cause contralateral dystonia or hemichorea."],
  GPE: ["Globus pallidus externus (GPe)", "External segment of the globus pallidus, medial to the putamen. Receives GABAergic input from the D2 (indirect pathway) striatal neurons and sends GABAergic output to the subthalamic nucleus (and GPi). When the striatum inhibits GPe, the STN is released and drives GPi harder, suppressing movement. Lesion: rarely isolated; in Parkinson disease, loss of dopamine leaves GPe over-inhibited, which releases the STN and contributes to bradykinesia."],
  GPI: ["Globus pallidus internus (GPi)", "Internal segment of the globus pallidus, medial to GPe; with substantia nigra pars reticulata it is the output nucleus of the basal ganglia. Tonically inhibits VA and VL thalamus (through the ansa lenticularis and lenticular fasciculus) and brainstem motor centres. The direct pathway inhibits GPi, releasing the thalamus and facilitating movement; the indirect and hyperdirect (STN) pathways excite it, suppressing movement. Pallidotomy or GPi deep brain stimulation reduces dyskinesia, rigidity and dystonia; bilateral pallidal damage (carbon monoxide poisoning, hypoxia) causes parkinsonism."],
  STN: ["Subthalamic nucleus (STN)", "Small lens-shaped glutamatergic nucleus in the subthalamus, above the substantia nigra and medial to the internal capsule. Receives GPe (indirect pathway) and direct motor cortex input (hyperdirect pathway), and excites GPi and SNr, braking movement. Lesion: contralateral hemiballismus (violent flinging of the proximal limb), classically from a small infarct or haemorrhage; it often settles over weeks. Overactive in Parkinson disease, which makes it the commonest deep brain stimulation target."],
  SN: ["Substantia nigra", "Pigmented nucleus in the midbrain, dorsal to the cerebral peduncle. Pars compacta (SNc): dopaminergic, neuromelanin-containing neurons that project to the striatum (nigrostriatal tract), exciting the direct pathway (D1) and inhibiting the indirect pathway (D2). Pars reticulata (SNr): GABAergic output, like GPi, to the thalamus and superior colliculus (saccades). Lesion: loss of SNc neurons, with Lewy bodies and loss of pigment, causes Parkinson disease (bradykinesia, rigidity, rest tremor, postural instability); MPTP toxicity does the same. Weber syndrome can involve the substantia nigra."],
  ANTL: ["Anterior lobe (spinocerebellum)", "Part of the cerebellum in front of the primary fissure, on the upper surface, including the anterior vermis and paravermis. Receives the dorsal and ventral spinocerebellar and cuneocerebellar tracts, so it holds a somatotopic map of the body (with a second map in the posterior lobe). Regulates muscle tone and corrects ongoing limb and trunk movement against the intended plan. Supplied by the superior cerebellar artery (SCA). Lesion: alcohol-related degeneration typically hits the anterior superior vermis first, causing a wide-based, unsteady gait and leg ataxia with relatively normal arms and speech."],
  VERM: ["Vermis and paravermis (spinocerebellum)", "Midline vermis and the strip of cortex beside it (paravermis or intermediate zone). Both receive spinocerebellar input from the trunk and limbs, plus vestibular, visual and auditory input. The vermis controls posture, trunk and gait, and saccade accuracy, through the fastigial nucleus to the vestibular nuclei and reticular formation. The paravermis adjusts ongoing limb movement through the interposed (globose and emboliform) nuclei to the red nucleus and VL thalamus. Lesion: midline damage (medulloblastoma in children, alcohol, tumours) causes truncal and gait ataxia, titubation and ocular dysmetria with relatively normal limb coordination when lying down."],
  HEM: ["Cerebellar hemispheres (cerebrocerebellum)", "Lateral zones of the posterior lobe, the largest part of the human cerebellum. Receive cerebral cortex through the pontine nuclei and the middle cerebellar peduncle, and climbing fibres from the inferior olive; project to the dentate nucleus and then to the opposite VL thalamus and motor and premotor cortex. Plan, time and coordinate skilled multi-joint movement, and contribute to motor learning, speech and cognition. Supplied by the SCA (upper) and PICA and AICA (lower). Lesion: ipsilateral limb ataxia: dysmetria, intention tremor, dysdiadochokinesia, rebound and decomposition of movement, with hypotonia and scanning dysarthria. Posterior lobe damage can also cause the cerebellar cognitive affective syndrome."],
  FN: ["Flocculonodular lobe (vestibulocerebellum)", "Flocculus and nodulus, behind the posterolateral fissure on the underside of the cerebellum, the oldest part. Receives the vestibular nerve directly and the vestibular nuclei, plus visual input; projects to the vestibular nuclei and the fastigial nucleus. Controls balance, the vestibulo-ocular reflex, smooth pursuit and gaze holding. Supplied by the PICA and AICA. Lesion: truncal ataxia with a broad-based gait and falls (patients may be unable to sit or stand unsupported even though limb coordination is normal), nystagmus (including gaze-evoked and downbeat nystagmus with flocculus damage) and vertigo; a typical site of medulloblastoma in children."],
  FAS: ["Fastigial nucleus", "Most medial deep cerebellar nucleus, in the roof of the 4th ventricle. Receives Purkinje cells of the vermis and the flocculonodular lobe, plus collaterals of mossy and climbing fibres. Projects through the inferior cerebellar peduncle (juxtarestiform body), both crossed (hook bundle of Russell) and uncrossed, to the vestibular nuclei and reticular formation, which give rise to the vestibulospinal and reticulospinal tracts. Controls posture, balance, axial and proximal muscles, and saccades. Lesion: truncal and gait ataxia, and saccadic dysmetria (overshoot of saccades)."],
  GLO: ["Globose nucleus", "Small rounded nucleus between the fastigial and emboliform nuclei; with the emboliform nucleus it forms the interposed nucleus (nucleus interpositus). Receives the paravermis (intermediate zone). Output leaves through the superior cerebellar peduncle, crosses in the caudal midbrain and reaches the opposite magnocellular red nucleus (rubrospinal tract) and VL thalamus. Corrects ongoing limb movement and regulates limb tone, especially in the proximal limb. Lesion: ipsilateral limb ataxia and tremor during movement; rarely damaged alone."],
  EMB: ["Emboliform nucleus", "Wedge-shaped nucleus just medial to the hilum of the dentate nucleus; the lateral part of the interposed nucleus. Receives the paravermis and collaterals of spinocerebellar fibres. Output runs through the superior cerebellar peduncle, crosses in the caudal midbrain, and ends in the opposite red nucleus and VL thalamus. Adjusts ongoing limb movement using sensory feedback. Lesion: ipsilateral action tremor and limb ataxia; rarely damaged alone."],
  DEN: ["Dentate nucleus", "Largest and most lateral deep cerebellar nucleus, a crumpled, serrated ribbon of grey matter (like the inferior olive) with its hilum facing medially. Receives Purkinje cells of the lateral hemisphere (cerebrocerebellum). Output leaves through the superior cerebellar peduncle, crosses in the caudal midbrain and reaches the opposite VL thalamus (then motor and premotor cortex) and parvocellular red nucleus, which projects to the inferior olive (Guillain-Mollaret triangle). Plans and initiates skilled movement and contributes to cognition. Lesion: ipsilateral intention tremor, dysmetria and dysdiadochokinesia; hypertrophic olivary degeneration with palatal tremor can follow damage to the triangle."],
  MCP: ["Middle cerebellar peduncle (MCP)", "Brachium pontis, the largest peduncle, joining the basis pontis to the cerebellar hemisphere. Entirely afferent: the crossed transverse pontine fibres from the pontine nuclei, carrying the cortex-to-cerebellum (corticopontocerebellar) projection, ending as mossy fibres mainly in the opposite hemisphere. Supplied by the AICA. Lesion: ipsilateral limb ataxia, as in AICA infarcts; the “MCP sign” (bilateral T2 hyperintensity) suggests multiple system atrophy (cerebellar type) or fragile X tremor-ataxia syndrome."],
  ICP: ["Inferior cerebellar peduncle (ICP)", "Joins the dorsolateral medulla to the cerebellum. Restiform body (afferent): dorsal spinocerebellar, cuneocerebellar, olivocerebellar (crossed climbing fibres), reticulocerebellar and trigeminocerebellar fibres. Juxtarestiform body (medial, two-way): vestibular input in, and fastigial and flocculonodular output to the vestibular nuclei. Supplied by the PICA. Lesion: ipsilateral limb and gait ataxia with falling toward the lesion (lateropulsion), as in lateral medullary (Wallenberg) syndrome."],
  SCP: ["Superior cerebellar peduncle (SCP)", "Brachium conjunctivum, running from the cerebellum up beside the 4th ventricle into the midbrain tegmentum. Mainly efferent: output of the dentate and interposed nuclei, which crosses in the decussation of the SCP (caudal midbrain) to reach the opposite red nucleus and VL thalamus; it also carries ventral spinocerebellar fibres in. Supplied by the SCA. Lesion below the decussation: ipsilateral intention tremor and ataxia; above it (midbrain, as in Claude syndrome): contralateral ataxia. Atrophy of the SCP on MRI is a feature of progressive supranuclear palsy."]
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
// Lumbar enlargement: rounder cord, thin white matter, broad dorsal horns and massive ventral horns (leg motor neurons)
const LUM_GRAY_D = "M100,94 C93,94 86,88 82,74 C78,60 72,50 64,47 C58,46 54,50 56,57 C59,68 63,80 66,90 C60,96 52,102 48,110 C43,118 42,128 45,137 C50,147 62,149 73,145 C84,141 90,128 92,114 C95,109 97,108 100,108 Z";
const lumbarGrayHalf = `<path class="g" d="${LUM_GRAY_D}"/>`;
const oliveCrumpleLeft = `<path class="g" d="M70,126 C67,121 63,124 59,120 C55,116 51,121 46,119 C41,117 39,123 35,125 C31,127 34,132 32,136 C30,140 36,143 37,147 C38,151 44,149 48,152 C52,155 56,150 61,152 C66,154 68,148 72,147 C74,145 71,142 67,143 C63,145 59,149 55,147 C51,145 47,149 43,146 C39,143 42,139 39,136 C36,133 41,129 43,126 C45,123 50,126 54,124 C58,122 62,126 67,128 Z" stroke="var(--gm-dark)" stroke-width="0.8"/>`;

const base = {
  c: () => `${sliceImgTag("c", 200, 200)}
    <path class="w" d="M99,36 C82,34 56,38 34,54 C14,68 6,84 8,102 C10,124 22,144 44,156 C64,166 84,166 97,160 L98,136 L100,136 L102,160 C116,166 136,166 156,156 C178,144 190,124 192,102 C194,84 186,68 166,54 C144,38 118,34 101,36 L100,58 Z"/>
    <g>${spinalGrayHalf}</g>
    <g transform="translate(200,0) scale(-1,1)">${spinalGrayHalf}</g>
    <circle class="v" cx="100" cy="99" r="2.8"/>
    <text class="lb" x="100" y="29">Dorsal median sulcus</text>
    <text class="lb" x="100" y="175">Anterior median fissure</text>`,

  lum: () => `${sliceImgTag("lum", 200, 200)}
    <path class="w" d="${LUM_D}"/>
    <g>${lumbarGrayHalf}</g>
    <g transform="translate(200,0) scale(-1,1)">${lumbarGrayHalf}</g>
    <circle class="v" cx="100" cy="101" r="2.2"/>
    <text class="lb" x="100" y="33">Dorsal median sulcus</text>
    <text class="lb" x="100" y="171">Anterior median fissure</text>`,

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
    <text class="lb" x="118" y="194">Left: basal ganglia &amp; internal capsule</text>
    <text class="lb" x="292" y="194">Right: thalamic nuclei</text>`,

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
    "olcb:0": "M126,122 C134,116 146,114 156,118 C164,122 168,130 165,138 C162,144 166,148 160,152 C152,156 140,154 132,148 C126,144 126,138 134,140 C142,142 154,144 158,138 C161,132 155,124 146,124 C138,124 132,128 127,126 Z",
    "ctt:0": "M128,119 C136,110 152,109 164,115 L162,119 C152,114 140,115 131,122 Z"   // amiculum: a thin cap over the olive
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
  lum: [
    { id: "lst", name: "Anterior white commissure (pain/temp decussation)", d: "M58,102 C76,110 90,112 100,112 C112,112 140,126 164,130", mx: 100, my: 113 },
    { id: "ast", name: "Anterior white commissure (crude touch decussation)", d: "M60,106 C78,114 90,115 100,115 C112,115 124,140 134,154", mx: 100, my: 116 },
    { id: "vsc", name: "Anterior white commissure (ventral spinocerebellar crossing)", d: "M66,108 C80,114 92,114 100,114 C114,114 152,112 171,114", mx: 100, my: 115 }
  ],
  c: [
    { id: "lst", name: "Anterior white commissure (pain/temp decussation)", d: "M42,96 C68,106 88,109 100,109 C112,109 138,124 166,126", mx: 100, my: 112 },
    { id: "ast", name: "Anterior white commissure (crude touch decussation)", d: "M44,100 C70,110 88,112 100,112 C114,112 128,138 144,152", mx: 100, my: 115 },
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
  cbl: ["cb"], rm: ["rm"], mm: ["mm"], cm: ["cm"], c: ["cd"], lum: ["cs"]
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
  ["c", "Cervical spinal cord: butterfly gray horns, funiculi & commissure"],
  ["lum", "Lumbar spinal cord: lumbar enlargement, large ventral horns, gracilis only"]
];

let sel = null;
let hov = null; // hovered item: previewed only while nothing is pinned
let currentMode = "vector"; // Default to clean Vector Atlas mode
let currentLat = "pathway";
let filterActiveOnly = true; // Auto-filter to active slices when a tract is selected!
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

// Lesion layer for the cervical cord slice: an (initially empty) group that lesion shading is drawn into, clipped to the cord outline
const CORD_D = "M99,36 C82,34 56,38 34,54 C14,68 6,84 8,102 C10,124 22,144 44,156 C64,166 84,166 97,160 L98,136 L100,136 L102,160 C116,166 136,166 156,156 C178,144 190,124 192,102 C194,84 186,68 166,54 C144,38 118,34 101,36 L100,58 Z";
const LUM_D = "M99,40 C80,38 58,42 42,56 C28,68 22,86 24,104 C26,124 38,142 56,152 C72,160 88,160 97,156 L98,138 L100,138 L102,156 C112,160 128,160 144,152 C162,142 174,124 176,104 C178,86 172,68 158,56 C142,42 120,38 101,40 L100,60 Z";
const RM_D = "M58,36 C40,34 22,48 18,72 C14,98 22,126 36,146 C48,160 66,174 96,174 L100,154 L104,174 C134,174 152,160 164,146 C178,126 186,98 182,72 C178,48 160,34 142,36 L124,48 C114,54 106,56 100,58 C94,56 86,54 76,48 Z";
const CP_D = "M56,36 C36,42 18,64 16,92 C14,116 20,146 44,166 C64,180 86,180 100,178 C114,180 136,180 156,166 C180,146 186,116 184,92 C182,64 164,42 144,36 L124,46 C114,50 106,48 100,50 C94,48 86,50 76,46 Z";
const RP_D = "M64,32 C42,40 20,64 18,96 C14,124 22,154 46,170 C66,182 88,182 100,180 C112,182 134,182 154,170 C178,154 186,124 182,96 C180,64 158,40 136,32 L120,42 C110,36 90,36 80,42 Z";
const RMB_D = "M62,32 C74,22 90,24 98,32 L100,34 L102,32 C110,24 126,22 138,32 C160,40 178,64 176,94 C182,126 172,160 148,174 C132,182 116,170 108,154 C104,146 96,146 92,154 C84,170 68,182 52,174 C28,160 18,126 24,94 C22,64 40,40 62,32 Z";
const CX_D = "M22,118 C12,76 48,28 114,14 C172,4 252,4 312,24 C368,44 390,88 380,126 C368,156 332,168 292,158 L262,178 C236,188 206,174 186,158 C148,164 112,160 88,144 C56,144 30,136 22,118 Z";
const LESION_CLIPS = { c: CORD_D, rm: RM_D, cp: CP_D, rp: RP_D, rmb: RMB_D, cx: CX_D };   // slices that can show a lesion, with the outline the shading is clipped to
const lesionLayer = lv => `<defs><clipPath id="clip-${lv}"><path d="${LESION_CLIPS[lv]}"/></clipPath></defs><g class="lov"></g>`;

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
  return lab(lv) + s + (LESION_CLIPS[lv] ? lesionLayer(lv) : "") + '<text class="lb" x="100" y="10" style="font-size:7.5px">Dorsal (Posterior)</text><text class="lb" x="100" y="197" style="font-size:7.5px">Ventral (Anterior)</text>';
}

const fore = k => base[k]() + FB[k].map(([id, x, y, rx, ry], i) =>
  `<ellipse class="st" data-id="${id}" cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="hsl(${(i * 47 + (k == "cx" ? 200 : 20)) % 360} 58% 48%)"><title>${ST[id][0]}</title></ellipse><text class="lb" x="${x}" y="${y + 2.5}">${id}</text>`
).join("") + (LESION_CLIPS[k] ? lesionLayer(k) : "");

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

// Widen every slice's viewBox just enough that no label is cut off (measured from the rendered text).
// All slices then share the widest width, so every card's image has the same aspect ratio and height;
// narrower drawings are centred in that width rather than stretched.
function fitSliceViewBoxes() {
  const groups = { wide: [], narrow: [] };
  document.querySelectorAll(".sec svg").forEach(svg => {
    groups[FB[svg.closest(".sec").dataset.slice] ? "wide" : "narrow"].push(svg);
  });
  const widths = {};
  Object.entries(groups).forEach(([kind, list]) => {
    let need = 0;
    list.forEach(svg => svg.querySelectorAll("text").forEach(t => {
      if (!t.getClientRects().length) return;
      const bb = t.getBBox();
      need = Math.max(need, bb.x + bb.width);
    }));
    widths[kind] = Math.max(kind === "wide" ? 400 : 360, Math.ceil(need) + 6);
  });
  const W = Math.max(widths.wide, widths.narrow);
  Object.entries(groups).forEach(([kind, list]) => {
    const x0 = -Math.round((W - widths[kind]) / 2);
    list.forEach(svg => svg.setAttribute("viewBox", `${x0} 0 ${W} 200`));
  });
}

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

// ---- Spinal cord lesion syndromes ----
// hit: tract id -> "f" (destroyed) or "p" (partly affected). uni: lesion is on one side only (side toggle).
// ov(): shading drawn for the RIGHT half of the image; it is mirrored for a left-sided lesion.
let LSIDE = "R";   // image side of a unilateral lesion: "L" = left half of the slice (the app's Left / Ipsi reference), "R" = right half
const LES = [
  {
    id: "les:cc", n: "Central cord syndrome", aka: "Schneider syndrome", lv: "c", uni: false,
    cause: "Cervical hyperextension injury in a spondylotic or stenotic canal (typically an older adult after a fall onto the face); also syringomyelia, intramedullary tumour and cervical spondylotic myelopathy.",
    area: "Central gray matter and the adjacent medial white matter: the spinothalamic fibres crossing in the anterior white commissure, the medial (arm) fibres of the lateral corticospinal tracts and the ventral horns. The dorsal columns and the peripheral (leg and sacral) fibres are spared.",
    motor: "Upper limb weakness greater than lower limb weakness, with the hands worst affected, because arm fibres lie medially in the corticospinal tract. LMN signs (flaccid weakness, atrophy) at the level from ventral horn damage; UMN signs (spasticity, hyperreflexia) below it.",
    sens: "Dissociated sensory loss: bilateral cape-like loss of pain and temperature over the shoulders and arms, with light touch, vibration and proprioception preserved. Sacral sensation is often spared.",
    other: "Urinary retention and bowel dysfunction may occur; burning dysaesthesia of the hands is common. Sacral sparing predicts better recovery.",
    exam: ["Compare pinprick and temperature (cool tuning fork or ice) with light touch, vibration and joint position over the arms: loss of pain and temperature with preserved dorsal column modalities is the hallmark.", "Grade strength in all four limbs (MRC scale): arms weaker than legs, grip and finger movements worst.", "Reflexes: reduced at the level (LMN), brisk below it; test the Hoffmann sign and plantar responses.", "Look for sacral sparing: perianal sensation, voluntary anal contraction and anal tone.", "Measure the post-void residual volume to assess bladder function."],
    img: "MRI of the cervical spine: T2 hyperintensity (oedema or haemorrhage) in the central cord, canal stenosis, disc or osteophyte disease, or a syrinx.",
    hit: { lcst: "p", lst: "p", ast: "p" },
    ov: () => '<ellipse cx="100" cy="102" rx="52" ry="32"/>'
  },
  {
    id: "les:ac", n: "Anterior cord syndrome", aka: "Anterior spinal artery syndrome \u00b7 Beck syndrome", lv: "c", uni: false,
    cause: "Anterior spinal artery occlusion or hypoperfusion (aortic surgery or dissection, severe hypotension), flexion injury with an anterior disc or bone fragment, or anterior cord compression.",
    area: "Anterior two-thirds of the cord: ventral horns, lateral and anterior corticospinal tracts, spinothalamic tracts and the other anterior and lateral funiculus pathways (vestibulospinal, reticulospinal, tectospinal, rubrospinal). The dorsal columns, supplied by the posterior spinal arteries, are spared.",
    motor: "Bilateral weakness or paralysis below the lesion, flaccid at first (spinal shock) then spastic, with hyperreflexia and Babinski signs. LMN signs at the level of ventral horn damage.",
    sens: "Bilateral loss of pain, temperature and crude touch below the lesion, with vibration, proprioception and fine touch preserved.",
    other: "Bladder and bowel dysfunction; autonomic dysfunction in high lesions. This has the poorest motor recovery of the incomplete syndromes.",
    exam: ["Compare pinprick and temperature (lost) with vibration (128 Hz tuning fork) and joint position sense (preserved) below the level.", "Strength in all limbs: bilateral weakness or paralysis below the level.", "Tone, reflexes and plantar responses: flaccid then spastic, hyperreflexic, extensor plantars.", "Map the sensory level with pinprick up the trunk.", "Perianal sensation, anal tone and post-void residual."],
    img: "MRI: T2 hyperintensity in the anterior cord, classically the “owl’s eyes” sign on axial images (bilateral anterior horn signal); diffusion MRI and vascular imaging for infarction.",
    hit: { lcst: "f", acst: "f", lst: "f", ast: "f", rub: "f", vst: "f", prst: "f", mrst: "f", tect: "f", vsc: "p" },
    ov: () => '<path d="M100,64 L172,64 L174,78 L174,112 L205,112 L205,178 L100,178 Z"/>'
  },
  {
    id: "les:pc", n: "Posterior cord syndrome", aka: "Dorsal column syndrome \u00b7 posterior spinal artery syndrome", lv: "c", uni: false,
    cause: "Posterior spinal artery occlusion (rare), tabes dorsalis (neurosyphilis), subacute combined degeneration (vitamin B12 deficiency, with lateral column involvement), hyperextension injury, or posterior compression by tumour.",
    area: "Dorsal columns (fasciculus gracilis and cuneatus) on both sides, sometimes the dorsal horns and the dorsal spinocerebellar tracts. The motor tracts and spinothalamic tracts are spared.",
    motor: "Strength is preserved, but loss of proprioceptive feedback causes sensory ataxia: a wide-based, stamping gait that worsens in the dark.",
    sens: "Bilateral loss of vibration, proprioception, fine touch and two-point discrimination below the lesion, with pain and temperature spared. Positive Romberg sign; lightning pains in tabes dorsalis.",
    other: "Areflexia when reflex afferents are interrupted (tabes); Lhermitte sign; reduced bladder sensation.",
    exam: ["Vibration with a 128 Hz tuning fork over distal bony prominences (toe, ankle, knee) and joint position sense of the great toe.", "Romberg test: steady with eyes open, unsteady with eyes closed.", "Heel-to-shin and finger-to-nose with eyes open versus closed; look for pseudoathetosis of outstretched fingers.", "Two-point discrimination, graphaesthesia and stereognosis.", "Confirm that pinprick, temperature and strength are normal (dissociated pattern)."],
    img: "MRI: T2 hyperintensity in the dorsal columns (inverted V sign in B12 deficiency). Blood tests: vitamin B12, syphilis serology.",
    hit: { dc: "f", dsc: "p" },
    ov: () => '<path d="M100,28 L146,28 L146,76 L100,76 Z"/>'
  },
  {
    id: "les:bs", n: "Brown-Séquard syndrome", aka: "Spinal cord hemisection syndrome", lv: "c", uni: true,
    cause: "Penetrating trauma (stab or gunshot), lateral compression by tumour or disc herniation, multiple sclerosis plaque, radiation myelopathy, epidural haematoma or ischaemia. A pure hemisection is rare; most cases are partial (Brown-Séquard plus).",
    area: "One half of the cord at the level of the lesion: the dorsal column, corticospinal, spinocerebellar and descending pathways on the lesion side, plus the spinothalamic tract on the lesion side (carrying pain and temperature from the opposite side of the body) and the horns at that level.",
    motor: "Ipsilateral to the lesion: LMN signs (flaccid weakness, atrophy) at the level and UMN signs below it (spastic paralysis, hyperreflexia, Babinski sign).",
    sens: "Ipsilateral loss of vibration, proprioception and fine touch below the lesion; contralateral loss of pain and temperature starting 1 to 2 segments below it, because spinothalamic fibres cross early. An ipsilateral band of all-modality loss lies at the level.",
    other: "Ipsilateral Horner syndrome if the lesion is at or above T1; ipsilateral segmental anhidrosis. Bladder function is often preserved because its pathways are bilateral.",
    exam: ["Compare the two sides: pinprick and temperature on the side opposite the weakness; vibration and joint position on the same side as the weakness.", "Strength and tone side by side: spastic weakness on the lesion side below the level.", "Reflexes: brisk on the lesion side below the level, absent at the level; test the plantar response (Babinski sign).", "Map the sensory level with pinprick up the trunk on both sides and find the upper edge of the ipsilateral all-modality band.", "In cervical lesions, look for Horner syndrome (ptosis, miosis, anhidrosis)."],
    img: "MRI of the spine at the clinical level: hemicord T2 signal, compressive lesion, haemorrhage or demyelinating plaque; contrast for tumour or inflammation.",
    hit: { dc: "f", lcst: "f", acst: "f", dsc: "f", vsc: "f", rub: "f", vst: "f", prst: "f", mrst: "f", tect: "f", lst: "f", ast: "f" },
    ov: () => '<path d="M100,20 L205,20 L205,180 L100,180 Z"/>'
  },
  // Cerebral strokes: drawn on the lateral view of the (left) hemisphere; hit keys are cortical areas (ST ids) as well as tracts
  {
    id: "les:aca", n: "ACA syndrome", aka: "Anterior cerebral artery syndrome · ACA territory infarction",
    grp: "cerebral", badge: "Cerebral stroke", where: "cerebral cortex", slice: "cerebral cortex (lateral view)", lv: "cx", uni: true,
    vessel: "Anterior cerebral artery: A1 and A2 segments, pericallosal and callosomarginal branches; the recurrent artery of Heubner supplies the head of the caudate and the anterior limb of the internal capsule.",
    cause: "Embolism (cardiac or carotid), atherothrombosis, vasospasm after rupture of an anterior communicating artery aneurysm, and compression under the falx in subfalcine herniation. ACA infarcts are uncommon (a few percent of strokes) because the anterior communicating artery provides collateral flow.",
    area: "The medial surface of the frontal and parietal lobes, which this lateral view cannot show; it is shaded as the strip along the upper margin, where the territory wraps onto the convexity. It includes the paracentral lobule (leg and foot areas of the motor and sensory cortex), the supplementary motor area, medial prefrontal and cingulate cortex, and the front four-fifths of the corpus callosum. Heubner’s artery adds the head of the caudate and the anterior limb of the internal capsule.",
    motor: "Contralateral weakness of the leg and foot, greater than the arm, with the face and hand largely spared (UMN signs). Proximal arm weakness can occur. Grasp reflex, gait apraxia and slowed, reduced initiation of movement.",
    sens: "Contralateral sensory loss in the leg and foot, mainly cortical modalities (joint position, two-point discrimination).",
    other: "Urinary incontinence (medial frontal micturition centre). Abulia, apathy and disinhibition; akinetic mutism when both sides are involved. Transcortical motor aphasia after a dominant supplementary motor area infarct. Callosal disconnection: apraxia of the left hand and alien hand. Bilateral ACA infarcts (both arteries from one A1) cause leg weakness on both sides that can mimic a spinal cord lesion.",
    exam: ["Compare leg and arm strength on the side opposite the lesion (MRC scale): the leg and foot are weaker; the face and hand are spared.", "Reflexes and plantar response in the weak leg; look for a grasp reflex in the opposite hand.", "Joint position sense and two-point discrimination in the foot.", "Behaviour and initiation: abulia, slowed responses, perseveration; ask about urinary incontinence.", "Ask the patient to mime actions with each hand (left-hand apraxia from callosal damage); watch the gait."],
    img: "CT or MRI with DWI: an infarct along the medial frontal and parietal lobes beside the falx. CT or MR angiography of the ACA and anterior communicating complex; look for vasospasm after subarachnoid haemorrhage.",
    hit: { PM: "f", M1: "p", S1: "p", PFC: "p", lcst: "p", CAU: "p" },
    ov: () => '<path d="M40,70 C60,40 90,22 114,14 C172,4 252,4 300,20 L292,34 C250,22 176,22 120,30 C92,38 66,56 52,78 Z"/>'
  },
  {
    id: "les:mcad", n: "MCA syndrome (dominant hemisphere)", aka: "Middle cerebral artery syndrome · left MCA syndrome in most people · MCA territory infarction",
    grp: "cerebral", badge: "Cerebral stroke", where: "cerebral cortex", slice: "cerebral cortex (lateral view)", lv: "cx", uni: true,
    vessel: "Middle cerebral artery: the M1 stem (with lenticulostriate branches to the basal ganglia and internal capsule), the superior division (frontal and anterior parietal lobes) and the inferior division (temporal and posterior parietal lobes).",
    cause: "The most common stroke territory. Cardioembolism (atrial fibrillation), artery-to-artery embolism from carotid bifurcation atherosclerosis, intracranial MCA stenosis and carotid dissection. Lenticulostriate small vessel disease causes deep lacunes instead of a cortical syndrome.",
    area: "Most of the lateral surface of the frontal, parietal and temporal lobes in the dominant (usually left) hemisphere: motor and sensory cortex for the face and arm, premotor cortex and frontal eye field, Broca and Wernicke areas, primary auditory cortex, the inferior parietal lobule and the underlying optic radiation. A proximal (M1) occlusion adds the basal ganglia and internal capsule.",
    motor: "Contralateral hemiparesis, face and arm worse than leg; the facial weakness is UMN (forehead spared). The eyes deviate toward the lesion, away from the weak side (frontal eye field). A proximal occlusion that reaches the internal capsule gives dense weakness of the face, arm and leg.",
    sens: "Contralateral sensory loss, face and arm worse than leg, with cortical features: impaired two-point discrimination, astereognosis and agraphaesthesia.",
    other: "Aphasia: global with a stem occlusion, Broca (non-fluent, comprehension preserved) with a superior division occlusion, Wernicke (fluent, poor comprehension) with an inferior division occlusion. Contralateral homonymous hemianopia or upper quadrantanopia (optic radiation, Meyer loop). Gerstmann syndrome (agraphia, acalculia, finger agnosia, left-right confusion) from the angular gyrus; ideomotor apraxia. A large (malignant) MCA infarct can swell and herniate within 2 to 5 days.",
    exam: ["NIH Stroke Scale for a quick, scored examination.", "Language: fluency, comprehension of commands, repetition, naming, reading and writing to type the aphasia.", "Face, arm and leg strength and pronator drift on the opposite side; the forehead is spared.", "Gaze deviation and visual fields by confrontation (hemianopia or upper quadrant loss).", "Cortical sensation: two-point discrimination, stereognosis, graphaesthesia; finger naming, left-right orientation and calculation (Gerstmann)."],
    img: "Immediate non-contrast CT (hyperdense MCA sign, loss of the insular ribbon, early grey-white blurring; ASPECTS score) and CT angiography for a large vessel occlusion (thrombectomy). CT perfusion or MRI with DWI and FLAIR to define the core and salvageable tissue. Carotid imaging and cardiac monitoring for the source.",
    hit: { M1: "f", S1: "f", PM: "f", BRO: "f", WER: "f", A1: "f", PAR: "f", PFC: "p", lcst: "f", cb: "f", cn2: "p", PUT: "p", CAU: "p" },
    ov: () => '<path d="M30,120 C24,98 36,82 52,80 C70,58 94,40 122,32 C176,24 250,24 292,36 C312,46 326,62 330,84 C334,104 330,126 322,142 L300,154 L262,170 C236,180 206,168 188,152 C150,158 114,154 90,140 C60,140 36,134 30,120 Z"/>'
  },
  {
    id: "les:mcan", n: "MCA syndrome (non-dominant hemisphere)", aka: "Middle cerebral artery syndrome · right MCA syndrome in most people · MCA territory infarction",
    grp: "cerebral", badge: "Cerebral stroke", where: "cerebral cortex", slice: "cerebral cortex (lateral view)", lv: "cx", uni: true,
    vessel: "Middle cerebral artery: the M1 stem (with lenticulostriate branches), the superior division and the inferior division, in the non-dominant (usually right) hemisphere.",
    cause: "As for the dominant side: cardioembolism, carotid artery-to-artery embolism, intracranial MCA stenosis and carotid dissection.",
    area: "Most of the lateral surface of the non-dominant frontal, parietal and temporal lobes (the slice shows the left hemisphere; the right is its mirror image): motor and sensory cortex for the face and arm, premotor cortex and frontal eye field, the inferior parietal lobule, the areas matching Broca and Wernicke, and the optic radiation. A proximal occlusion adds the basal ganglia and internal capsule.",
    motor: "Contralateral (usually left) hemiparesis, face and arm worse than leg, with UMN facial weakness. Gaze deviation toward the lesion. Motor impersistence (cannot keep the eyes closed or the tongue out).",
    sens: "Contralateral cortical sensory loss, face and arm worse than leg; extinction to double simultaneous stimulation.",
    other: "Language is preserved. Hemispatial neglect of the left side (inferior parietal lobule), anosognosia (unaware of or denies the deficit), asomatognosia, constructional and dressing apraxia, and aprosodia (flat speech, with damage to the areas matching Broca and Wernicke). Contralateral homonymous hemianopia. Neglect and anosognosia limit rehabilitation more than the weakness.",
    exam: ["Neglect: line bisection, letter or star cancellation and clock drawing; watch whether the patient ignores people and objects on the left.", "Extinction: touch both hands (and show both visual fields) at once.", "Ask the patient about the weakness (anosognosia) and whether the weak arm belongs to them.", "Face, arm and leg strength, pronator drift, gaze deviation and visual fields.", "Copy a simple figure (constructional apraxia); listen for flat, monotone speech."],
    img: "As for the dominant side: immediate non-contrast CT with ASPECTS, CT angiography for large vessel occlusion, CT perfusion or MRI with DWI, then carotid and cardiac work-up.",
    hit: { M1: "f", S1: "f", PM: "f", A1: "f", PAR: "f", PFC: "p", lcst: "f", cb: "f", cn2: "p", PUT: "p", CAU: "p" },
    ov: () => '<path d="M30,120 C24,98 36,82 52,80 C70,58 94,40 122,32 C176,24 250,24 292,36 C312,46 326,62 330,84 C334,104 330,126 322,142 L300,154 L262,170 C236,180 206,168 188,152 C150,158 114,154 90,140 C60,140 36,134 30,120 Z"/>'
  },
  {
    id: "les:pca", n: "PCA syndrome", aka: "Posterior cerebral artery syndrome · PCA territory infarction",
    grp: "cerebral", badge: "Cerebral stroke", where: "cerebral cortex", slice: "cerebral cortex (lateral view)", lv: "cx", uni: true,
    vessel: "Posterior cerebral artery (from the basilar tip, or from the internal carotid in a fetal PCA): P1 thalamoperforating and P2 thalamogeniculate branches to the thalamus and midbrain, and cortical branches (calcarine, parieto-occipital, temporal) to the occipital lobe, inferomedial temporal lobe and splenium.",
    cause: "Embolism from the heart or the vertebrobasilar system (“top of the basilar”), vertebrobasilar atherothrombosis, vertebral dissection and compression of the PCA against the tentorium in uncal herniation.",
    area: "The occipital lobe with the calcarine (primary visual) cortex, the inferomedial temporal lobe with the hippocampus, and the splenium of the corpus callosum; most of this lies on the medial and inferior surfaces, so the lateral view shows the occipital pole and the inferior temporal margin. Proximal occlusions add the thalamus (VPL, VPM, LGN, pulvinar) and the midbrain.",
    motor: "Usually no weakness. Hemiparesis only when a proximal occlusion reaches the cerebral peduncle; thalamic infarcts can cause hemiataxia or involuntary movements.",
    sens: "Contralateral hemisensory loss when the thalamus (VPL, VPM) is involved, sometimes followed weeks later by thalamic pain (Dejerine-Roussy syndrome).",
    other: "Contralateral homonymous hemianopia with macular sparing (the occipital pole often has collateral supply from the MCA); the patient is usually aware of it. Dominant side with the splenium: alexia without agraphia, colour anomia and memory loss. Non-dominant side: prosopagnosia and visual neglect. Bilateral: cortical blindness (Anton syndrome when it is denied) and amnesia. Visual hallucinations are common.",
    exam: ["Visual fields by confrontation in each quadrant; check whether central vision is spared (macular sparing).", "Reading and writing: can the patient write a sentence but not read it back (alexia without agraphia)?", "Naming colours and recognising faces.", "Memory: recall of three words after a delay.", "Sensation on both sides of the body (thalamic involvement); strength and eye movements for midbrain involvement."],
    img: "CT or MRI with DWI: an occipital and inferomedial temporal infarct, often with thalamic or midbrain involvement. CT or MR angiography of the vertebrobasilar system and PCA; look for a fetal PCA arising from the internal carotid.",
    hit: { V1: "f", cn2: "f", LGN: "p", PUL: "p", VPL: "p", VPM: "p" },
    ov: () => '<path d="M326,30 C364,52 390,90 380,126 C368,156 332,168 292,158 L262,178 C250,182 238,182 228,180 L236,166 C262,162 290,150 312,132 C322,108 326,72 326,30 Z"/>'
  },
  {
    id: "les:wsa", n: "MCA/ACA watershed syndrome", aka: "Anterior (cortical) border-zone infarction · anterior watershed infarction · “man in a barrel” syndrome (brachial diplegia) when both sides are involved",
    grp: "cerebral", badge: "Cerebral stroke", where: "cerebral cortex", slice: "cerebral cortex (lateral view)", lv: "cx", uni: false,
    vessel: "The border zone between the ACA and MCA cortical territories: a parasagittal strip over the frontal and parietal convexity, at the farthest reach of both arteries.",
    cause: "Low perfusion pressure: cardiac arrest, profound hypotension, cardiac surgery, or severe stenosis or occlusion of the internal carotid artery (then often on one side only, the side of the stenosis). Small emboli that lodge in the distal field contribute.",
    area: "The parasagittal frontal and parietal convexity, a few centimetres from the midline, between the ACA and MCA fields: the shoulder, proximal arm and hip parts of the motor and sensory cortex, the premotor cortex and the prefrontal convexity. The face, hand and distal leg areas are relatively spared.",
    motor: "Proximal arm and shoulder weakness with the hand and face relatively spared. After global hypoperfusion both sides are affected: the “man in a barrel”, with the arms weak and the legs much less so.",
    sens: "Proximal sensory loss in the arm and shoulder, often mild.",
    other: "Transcortical motor aphasia with a dominant anterior border-zone infarct (non-fluent speech with preserved repetition and comprehension). After cardiac arrest it is often accompanied by other watershed infarcts and hypoxic encephalopathy. A border-zone infarct on one side points to carotid disease on that side.",
    exam: ["Compare proximal (shoulder abduction, elbow flexion) with distal (grip, finger) strength in both arms, and both with the legs.", "Face and hand strength (relatively spared).", "Language: fluency with intact repetition (transcortical motor aphasia).", "Sensation in the shoulder and proximal arm.", "Blood pressure history and carotid bruits; consciousness and cognition after cardiac arrest."],
    img: "MRI with DWI: a parasagittal chain or strip of infarcts along the frontal and parietal convexity, on both sides after global hypoperfusion. Carotid imaging (Doppler, CT or MR angiography) when one side is involved.",
    hit: { M1: "f", PM: "f", S1: "p", PFC: "p", PAR: "p", lcst: "p" },
    ov: () => '<path d="M56,84 C70,62 94,44 122,36 C176,28 250,28 292,40 L286,54 C248,42 178,42 126,50 C100,58 80,74 68,94 Z"/>'
  },
  {
    id: "les:wsp", n: "MCA/PCA watershed syndrome", aka: "Posterior (cortical) border-zone infarction · posterior watershed infarction · parieto-temporo-occipital watershed infarction",
    grp: "cerebral", badge: "Cerebral stroke", where: "cerebral cortex", slice: "cerebral cortex (lateral view)", lv: "cx", uni: false,
    vessel: "The border zone between the MCA and PCA cortical territories at the parieto-temporo-occipital junction (angular gyrus region).",
    cause: "Low perfusion pressure (cardiac arrest, profound hypotension, cardiac surgery) or severe internal carotid stenosis or occlusion, sometimes with small emboli lodging in the distal field.",
    area: "The parieto-temporo-occipital junction: the angular and supramarginal gyri, the posterior temporal cortex and the lateral parieto-occipital cortex, with the optic radiation beneath.",
    motor: "Usually little or no weakness.",
    sens: "Usually only mild cortical sensory changes.",
    other: "Visual field loss (often a lower quadrantanopia or hemianopia). Dominant side: transcortical sensory aphasia (fluent speech and poor comprehension with preserved repetition), alexia and Gerstmann features. Non-dominant side: neglect and visuospatial deficits. Both sides: Balint syndrome (simultanagnosia, optic ataxia, oculomotor apraxia) and cortical visual disturbance.",
    exam: ["Visual fields by confrontation, especially the lower quadrants.", "Language: comprehension, repetition (preserved) and reading.", "Neglect tests (line bisection, cancellation) and drawing.", "Describe a busy picture (simultanagnosia) and reach for a target under visual guidance (optic ataxia).", "Finger naming, left-right orientation, writing and calculation."],
    img: "MRI with DWI: infarcts at the parieto-temporo-occipital junction, on both sides after global hypoperfusion. Carotid and vertebral imaging; check for a fetal PCA, which shifts the border zone.",
    hit: { PAR: "f", WER: "p", V1: "p", cn2: "p" },
    ov: () => '<path d="M292,34 C314,44 330,62 336,86 C340,110 334,132 322,148 L296,156 C308,134 312,110 306,88 C300,68 288,54 274,46 Z"/>'
  },
  {
    id: "les:web", n: "Ventromedial midbrain syndrome", aka: "Weber syndrome · ventral (anterior) midbrain syndrome · cerebral peduncle syndrome · superior alternating hemiplegia · oculomotor alternating hemiplegia",
    grp: "brain", badge: "Brainstem stroke", where: "rostral midbrain", slice: "rostral midbrain", lv: "rmb", uni: true,
    vessel: "Paramedian (interpeduncular) penetrating branches of the proximal posterior cerebral artery (P1) and the top of the basilar artery.",
    cause: "Ischaemic stroke in the paramedian midbrain branches: small vessel disease, basilar tip or P1 atherothrombosis, or embolism (“top of the basilar”). Also haemorrhage, tumour, demyelination, and compression of the cerebral peduncle and CN III by uncal herniation or a posterior communicating artery aneurysm.",
    area: "Ventromedial midbrain on one side: the cerebral peduncle (crus cerebri), carrying the corticospinal, corticobulbar and corticopontine fibres, and the oculomotor nerve fascicles as they cross it to exit into the interpeduncular fossa. The substantia nigra may be involved. The red nucleus, medial lemniscus and superior cerebellar peduncle fibres in the tegmentum are spared.",
    motor: "Ipsilateral oculomotor palsy: ptosis, an eye that rests “down and out”, and weak elevation, depression and adduction. Contralateral hemiparesis of the arm and leg with UMN signs, plus contralateral UMN facial weakness (lower face) and tongue weakness from corticobulbar damage; dysarthria. Contralateral parkinsonism if the substantia nigra is involved.",
    sens: "Usually normal, because the medial lemniscus and spinothalamic tract lie dorsolaterally in the tegmentum.",
    other: "The pupil on the lesion side is often dilated and unreactive, because parasympathetic fibres run in the fascicles. “Superior alternating hemiplegia”: cranial nerve sign on the lesion side, limb weakness on the opposite side (the corticospinal fibres cross lower, in the medulla). When tremor or ataxia is added the lesion has reached the tegmentum (Benedikt syndrome).",
    exam: ["Eyelid and eye position: ptosis and an eye turned down and out on the lesion side; test elevation, depression and adduction (the lateral rectus and superior oblique still work).", "Pupils: size in light and dark and the light reflex; a dilated, unreactive pupil on the lesion side.", "Strength, tone, reflexes and plantar responses in the arm and leg on the opposite side; lower face and tongue on that side.", "Look for bradykinesia and rigidity on the weak side (substantia nigra).", "Confirm that sensation is normal and that there is no tremor or ataxia beyond what weakness explains."],
    img: "MRI with DWI: an infarct in the ventromedial midbrain (cerebral peduncle) at the level of the red nucleus. MR or CT angiography of the basilar tip and P1 segments; urgent CT if herniation or aneurysm is possible.",
    hit: { lcst: "f", cb: "f", "cn3|Oculomotor nerve fascicles": "f", "pcb|Frontopontine fibres": "f", "pcb|Parieto-occipito-temporopontine": "p", ns: "p" },
    ov: () => '<path d="M104,146 L106,120 L116,118 C136,122 158,124 178,118 L186,128 C184,150 170,168 150,176 C134,182 118,172 108,154 Z"/>'
  },
  {
    id: "les:ben", n: "Paramedian midbrain syndrome", aka: "Benedikt syndrome · midbrain tegmental syndrome · Benedict syndrome (alternative spelling)",
    grp: "brain", badge: "Brainstem stroke", where: "rostral midbrain", slice: "rostral midbrain", lv: "rmb", uni: true,
    vessel: "Paramedian penetrating branches of the proximal posterior cerebral artery (P1) and the top of the basilar artery.",
    cause: "Ischaemic stroke in the paramedian midbrain branches (small vessel disease, basilar tip or P1 disease, embolism). Also haemorrhage, cavernoma, tumour, tuberculoma, demyelination and trauma.",
    area: "Paramedian midbrain tegmentum on one side: the oculomotor nerve fascicles, the red nucleus with the crossed dentato-rubro-thalamic (superior cerebellar peduncle) fibres around it, and the medial lemniscus. It often reaches ventrally into the substantia nigra and the medial cerebral peduncle.",
    motor: "Ipsilateral oculomotor palsy (ptosis, eye down and out, often a dilated pupil). Contralateral involuntary movements: a coarse rest, postural and action tremor (rubral or Holmes tremor), sometimes chorea or athetosis. Contralateral ataxia (the cerebellar outflow has already crossed). Contralateral hemiparesis if the cerebral peduncle is involved.",
    sens: "Contralateral loss of vibration, proprioception and fine touch (medial lemniscus); pain and temperature may be reduced if the lesion extends laterally.",
    other: "It combines the tegmental features of Claude syndrome with the peduncular features of Weber syndrome. The tremor often appears weeks to months after the stroke. Vertical gaze can be impaired if the lesion reaches the rostral interstitial nucleus of the MLF.",
    exam: ["Eyelid, eye position and pupils: ptosis, eye down and out and a dilated pupil on the lesion side.", "Watch the opposite arm at rest, with arms outstretched and during finger-to-nose: a coarse, slow tremor in all three positions.", "Finger-to-nose and heel-to-shin on the opposite side for ataxia and dysmetria; look for chorea.", "Vibration and joint position sense on the opposite side.", "Strength, tone, reflexes and plantars on the opposite side, and vertical eye movements."],
    img: "MRI with DWI: a paramedian tegmental midbrain lesion through the red nucleus, often extending into the cerebral peduncle. MR or CT angiography of the basilar tip and P1 segments.",
    hit: { "cn3|Oculomotor nerve fascicles": "f", "rub|Red nucleus": "f", dtc: "f", ml: "f", crb: "p", tl: "p", ns: "p", lcst: "p", cb: "p" },
    ov: () => '<path d="M102,96 L120,88 C138,88 152,94 164,102 L164,116 C150,122 132,122 116,122 L112,150 L102,150 Z"/>'
  },
  {
    id: "les:cla", n: "Claude syndrome", aka: "Dorsal (dorsomedial) midbrain tegmental syndrome · inferior red nucleus syndrome",
    grp: "brain", badge: "Brainstem stroke", where: "rostral midbrain", slice: "rostral midbrain", lv: "rmb", uni: true,
    vessel: "Paramedian penetrating branches of the proximal posterior cerebral artery (P1) and the top of the basilar artery.",
    cause: "Ischaemic stroke in the paramedian midbrain branches, usually small vessel disease or embolism; less often haemorrhage, cavernoma, tumour or demyelination.",
    area: "Dorsomedial midbrain tegmentum on one side: the oculomotor nerve fascicles (sometimes the oculomotor nucleus) and the dorsomedial red nucleus with the crossed dentato-rubro-thalamic fibres of the superior cerebellar peduncle. The medial lemniscus, substantia nigra and cerebral peduncle are spared.",
    motor: "Ipsilateral oculomotor palsy (ptosis, eye down and out, often a dilated pupil). Contralateral cerebellar ataxia: dysmetria, dysdiadochokinesia, intention tremor and gait ataxia (the cerebellar outflow crossed in the caudal midbrain, so the deficit is opposite the lesion). Strength is preserved.",
    sens: "Normal, because the medial lemniscus and spinothalamic tract are spared.",
    other: "Ataxia without weakness or sensory loss separates it from Benedikt syndrome (which adds lemniscal loss, involuntary movements and often weakness) and from Weber syndrome (weakness without ataxia). Dysarthria is common. A nuclear lesion can cause bilateral ptosis and an upgaze deficit in the other eye.",
    exam: ["Eyelid, eye position and pupils on the lesion side; check both eyelids and upgaze of the other eye for a nuclear lesion.", "Finger-to-nose, heel-to-shin and rapid alternating movements on the side opposite the lesion.", "Gait and tandem walking.", "Strength and reflexes in all limbs (normal).", "Vibration, joint position and pinprick on both sides (normal)."],
    img: "MRI with DWI: a small dorsomedial midbrain tegmental lesion at the red nucleus, sparing the cerebral peduncle. MR or CT angiography of the basilar tip and P1 segments.",
    hit: { "cn3|Oculomotor nerve fascicles": "f", "rub|Red nucleus": "f", dtc: "f", crb: "p", "cn3|Oculomotor nucleus": "p" },
    ov: () => '<path d="M102,84 L114,84 C126,90 138,94 142,104 C144,114 138,120 128,120 L112,124 L110,140 L102,140 Z"/>'
  },
  {
    id: "les:vmp", n: "Ventromedial pontine syndrome", aka: "Medial (paramedian) pontine syndrome · paramedian pontine infarction · Raymond syndrome (caudal form with abducens palsy; abducens or middle alternating hemiplegia)",
    grp: "brain", badge: "Brainstem stroke", where: "rostral pons", slice: "rostral pons", lv: "rp", uni: true,
    vessel: "Paramedian (penetrating) branches of the basilar artery.",
    cause: "Most often small vessel disease of a single paramedian penetrating artery (a lacune) or branch atheromatous disease, where plaque in the basilar wall blocks the origin of the branch; both are linked to hypertension and diabetes. Also basilar stenosis, embolism and, rarely, demyelination or haemorrhage.",
    area: "Paramedian basis pontis on one side, a wedge from the ventral surface toward the midline: the corticospinal and corticobulbar fibres, the pontine nuclei and the transverse pontine fibres. Larger infarcts reach dorsally into the medial lemniscus. The tegmentum (MLF, PPRF, cranial nerve nuclei) and the lateral pons (spinothalamic tract, trigeminal nuclei, MCP) are spared. At the caudal pons the same territory includes the abducens fascicles (Raymond syndrome).",
    motor: "Contralateral hemiparesis of the face (lower face, UMN pattern), arm and leg with spasticity, hyperreflexia and a Babinski sign; dysarthria and dysphagia from corticobulbar damage. Ataxia of the weak limbs out of proportion to their weakness (ataxic hemiparesis) or dysarthria with a clumsy hand, from damage to the pontine nuclei and transverse pontine fibres. In the caudal (Raymond) form, an ipsilateral lateral rectus palsy is added.",
    sens: "Usually normal. If the infarct reaches the medial lemniscus, contralateral loss of vibration, proprioception and fine touch. Pain and temperature are spared because the spinothalamic tract lies laterally.",
    other: "Eye movements are normal at this level unless the lesion extends dorsally (MLF: internuclear ophthalmoplegia). Many lacunar syndromes come from here: pure motor hemiparesis, ataxic hemiparesis and dysarthria-clumsy hand. Deficits often progress in steps over 24 to 72 hours with branch atheromatous disease. Bilateral paramedian infarction causes locked-in syndrome.",
    exam: ["Grade strength in all four limbs (MRC scale) and look at the face: lower face weakness on the same side as the weak limbs, with the forehead spared (UMN pattern).", "Tone, reflexes and plantar responses on the weak side.", "Finger-to-nose and heel-to-shin on the weak side: ataxia out of proportion to weakness suggests pontine nuclei involvement.", "Speech and swallow screen: dysarthria and dysphagia are common.", "Vibration and joint position sense on the weak side, and a check that pinprick, facial sensation and eye movements are normal. In a caudal lesion test abduction of the eye on the lesion side."],
    img: "MRI with DWI: a paramedian wedge-shaped infarct reaching the ventral surface of the pons (branch atheromatous disease) or a small deep lacune that does not. MR or CT angiography for basilar stenosis; vessel wall imaging can show the plaque.",
    hit: { lcst: "f", acst: "f", cb: "f", "pcb|Transverse pontine fibres": "f", ml: "p" },
    ov: () => '<path d="M100,110 L114,108 C126,112 134,124 138,140 C140,156 138,168 136,182 L100,182 Z"/>'
  },
  {
    id: "les:vp", n: "Ventral pontine syndrome", aka: "Millard-Gubler syndrome · ventrocaudal pontine syndrome · facial-abducens hemiplegia (hemiplegia alternans abducentofacialis)",
    grp: "brain", badge: "Brainstem stroke", where: "caudal pons", slice: "caudal pons", lv: "cp", uni: true,
    vessel: "Paramedian and short circumferential branches of the basilar artery; occasionally the anterior inferior cerebellar artery (AICA).",
    cause: "Ischaemic stroke from occlusion of basilar branches (small vessel disease, branch atheromatous disease, basilar atherothrombosis or embolism). Also demyelination (multiple sclerosis), tumour (pontine glioma, metastasis), haemorrhage and cavernoma.",
    area: "Ventral caudal pons on one side: the corticospinal and corticobulbar fibres in the basis pontis, the pontine nuclei and transverse pontine fibres, and the fascicles of the abducens (CN VI) and facial (CN VII) nerves as they run ventrally to exit at the pontomedullary junction. The dorsal tegmentum (abducens nucleus, PPRF, MLF, vestibular nuclei) and the lateral structures (spinothalamic tract, spinal trigeminal nucleus) are spared; the medial lemniscus may be grazed.",
    motor: "Contralateral hemiplegia of the arm and leg with UMN signs (the corticospinal fibres have not yet crossed). Ipsilateral lateral rectus palsy: the eye on the lesion side cannot abduct and rests turned in. Ipsilateral LMN facial palsy, forehead included. Dysarthria from corticobulbar damage. “Alternating” means cranial nerve signs on the lesion side and limb signs on the opposite side.",
    sens: "Usually normal, because the spinothalamic and trigeminal pathways lie dorsolaterally. If the lesion reaches the medial lemniscus, contralateral loss of vibration and position sense.",
    other: "Horizontal diplopia, worse when looking toward the lesion. Only one eye fails to abduct (a fascicular lesion), whereas in Foville syndrome the abducens nucleus is hit and conjugate gaze toward the lesion is lost in both eyes. Raymond syndrome is the variant with abducens palsy and contralateral hemiplegia but no facial palsy.",
    exam: ["Eye movements: abduction of the eye on the lesion side fails; the other eye adducts normally (no gaze palsy). Cover test for esotropia; ask about horizontal double vision.", "Face: ask the patient to raise the eyebrows, close the eyes tightly and show the teeth. Weakness of the whole face, forehead included, on the lesion side means an LMN lesion.", "Strength, tone, reflexes and plantar responses in the arm and leg on the opposite side.", "Vibration and joint position on the weak side; confirm that pinprick on the face and body is normal.", "Speech and swallow screen."],
    img: "MRI with DWI: a ventral caudal pontine lesion at the level of the facial colliculus. MR or CT angiography of the basilar artery. In a younger patient, look for other white matter lesions of multiple sclerosis.",
    hit: { lcst: "f", acst: "f", cb: "f", pcb: "f", "cn6|Abducens nerve fascicles": "f", "cn7|Facial motor nucleus": "p", ml: "p", rub: "p" },
    ov: () => '<path d="M100,104 L114,104 L114,92 L126,92 L128,84 L140,84 C152,96 162,116 166,138 L162,180 L100,180 Z"/>'
  },
  {
    id: "les:fov", n: "Inferior medial pontine syndrome", aka: "Foville syndrome · dorsal (tegmental) caudal pontine syndrome · inferior (pontine) Foville syndrome, as distinct from the superior (peduncular) Foville syndrome of the midbrain",
    grp: "brain", badge: "Brainstem stroke", where: "caudal pons", slice: "caudal pons", lv: "cp", uni: true,
    vessel: "Paramedian and short circumferential branches of the basilar artery; sometimes the AICA.",
    cause: "Ischaemic stroke from occlusion of basilar branches supplying the caudal pontine tegmentum and the medial basis. Also haemorrhage, cavernoma, demyelination (multiple sclerosis) and tumour.",
    area: "Paramedian caudal pons on one side, from the floor of the 4th ventricle down into the medial basis: the abducens nucleus and the neighbouring paramedian pontine reticular formation (PPRF), the facial nerve genu looping over it (facial colliculus) and the facial motor nucleus, the MLF, the medial lemniscus and the corticospinal and corticobulbar fibres. Lateral extension can involve the spinal trigeminal nucleus, vestibular nuclei and descending sympathetic fibres.",
    motor: "Ipsilateral horizontal gaze palsy: neither eye can look toward the lesion (abducens nucleus and PPRF), and the eyes may rest deviated away from the lesion, toward the weak limbs. Ipsilateral LMN facial palsy, forehead included (facial genu and nucleus). Contralateral hemiparesis with UMN signs. If the MLF is also involved, one-and-a-half syndrome: the only horizontal movement left is abduction of the eye on the side opposite the lesion.",
    sens: "Contralateral loss of vibration, proprioception and fine touch (medial lemniscus). Pain and temperature are usually spared; ipsilateral facial numbness if the lesion reaches the spinal trigeminal nucleus.",
    other: "Vertical eye movements and convergence are spared (midbrain). The gaze deviation is the reverse of a hemispheric stroke, where the eyes look toward the lesion and away from the weak side. Vertigo, nystagmus, ipsilateral Horner syndrome, ataxia and ipsilateral hearing loss are variable. Not to be confused with the superior (midbrain) form, which gives a contralateral gaze palsy with hemiplegia.",
    exam: ["Horizontal pursuit and saccades in both directions: neither eye moves past the midline toward the lesion side; check vertical gaze and convergence (preserved).", "Oculocephalic (doll’s eye) manoeuvre: it does not overcome an abducens nucleus palsy (the nucleus holds both motor neurons and interneurons), but can overcome a pure PPRF palsy.", "Look for adduction failure of the eye on the lesion side when looking away (MLF: one-and-a-half syndrome).", "Facial strength including the forehead on the lesion side; strength, tone, reflexes and plantars on the opposite side.", "Vibration and joint position on the weak side; facial pinprick, corneal reflex, hearing and Horner signs for lateral extension."],
    img: "MRI with DWI: a paramedian dorsal caudal pontine lesion at the facial colliculus, often extending ventrally. MR or CT angiography of the basilar artery.",
    hit: { "cn6|Abducens nucleus": "f", "cn6|Abducens nerve fascicles": "f", "cn7|Facial colliculus (internal genu)": "f", "cn7|Facial motor nucleus": "f", prst: "f", mlf: "f", ml: "f", lcst: "f", acst: "f", cb: "f", tect: "f", tl: "p", ll: "p", "cn8|Medial vestibular nucleus": "p", pcb: "p" },
    ov: () => '<path d="M100,50 C108,49 116,48 124,47 L136,48 L142,64 L142,94 L134,108 L134,152 L100,154 Z"/>'
  },
  {
    id: "les:lp", n: "Lateral pontine syndrome", aka: "AICA syndrome (anterior inferior cerebellar artery) · inferior (caudal) lateral pontine syndrome · Marie-Foix syndrome (a lateral pontine variant that adds contralateral hemiparesis)",
    grp: "brain", badge: "Brainstem stroke", where: "caudal pons", slice: "caudal pons", lv: "cp", uni: true,
    vessel: "Anterior inferior cerebellar artery (AICA), including the labyrinthine (internal auditory) artery, which usually arises from it.",
    cause: "Ischaemic stroke from AICA occlusion: basilar atherothrombosis at the AICA origin, disease of the AICA itself, embolism or vertebrobasilar dissection. Less often haemorrhage or a mass at the cerebellopontine angle.",
    area: "Lateral caudal pontine tegmentum and the middle cerebellar peduncle on one side: the facial motor nucleus and fascicles, spinal trigeminal nucleus and tract, vestibular and cochlear nuclei, spinothalamic tract (spinal lemniscus), descending sympathetic fibres, the middle and inferior cerebellar peduncles and the inferolateral cerebellum, plus the inner ear through the labyrinthine artery. The medial structures (corticospinal tract, medial lemniscus, abducens nucleus, MLF) are spared.",
    motor: "Strength is preserved because the basis pontis is spared. Ipsilateral LMN facial palsy, forehead included. Ipsilateral limb and gait ataxia with dysmetria (middle and inferior cerebellar peduncles, cerebellum). Ipsilateral jaw weakness if the infarct reaches the trigeminal motor nucleus higher up.",
    sens: "Ipsilateral loss of pain and temperature on the face (spinal trigeminal nucleus and tract) with contralateral loss of pain and temperature on the body (spinothalamic tract): the same crossed pattern as Wallenberg syndrome. Vibration and proprioception are spared.",
    other: "Sudden ipsilateral sensorineural hearing loss and tinnitus (labyrinthine artery and cochlear nuclei), and the facial palsy, separate AICA from PICA (Wallenberg) infarction. Vertigo, nausea, vomiting and nystagmus; ipsilateral Horner syndrome. Dysphagia and hoarseness are usually absent because the nucleus ambiguus lies in the medulla. Acute hearing loss with vertigo can come before the infarct and mimic labyrinthitis.",
    exam: ["Hearing on each side (finger rub or whisper), with Weber and Rinne tests: a sensorineural loss on the lesion side.", "Face: weakness of the whole face, forehead included, on the lesion side; corneal reflex and pinprick on the face (reduced on the lesion side).", "Pinprick and temperature on the body: reduced on the side opposite the lesion.", "Cerebellar tests on the lesion side (finger-to-nose, heel-to-shin, rapid alternating movements) and gait; HINTS exam, where new hearing loss (“HINTS plus”) points to a central cause.", "Eyes: ptosis and miosis (Horner syndrome) and nystagmus. Confirm that strength and vibration sense are normal."],
    img: "MRI with DWI covering the lateral pons, middle cerebellar peduncle and inferolateral cerebellum. MR or CT angiography of the basilar artery and the AICA origin. Audiometry to document the hearing loss.",
    hit: { cn5: "f", sl: "f", dsc: "f", vst: "f", ll: "f", "cn7|Facial motor nucleus": "f", "cn8|Cochlear nuclei": "f", "cn8|Lateral vestibular nucleus": "f", "cn8|Medial vestibular nucleus": "p", "pcb|Middle cerebellar peduncle": "f", rub: "p" },
    ov: () => '<path d="M126,46 L144,36 C164,42 182,64 184,92 C186,112 182,128 176,140 L158,134 C152,118 142,106 128,100 C124,80 122,60 126,46 Z"/>'
  },
  {
    id: "les:lis", n: "Locked-in syndrome", aka: "Cerebromedullospinal disconnection · pseudocoma · de-efferented state · bilateral ventral pontine syndrome",
    grp: "brain", badge: "Brainstem stroke", where: "caudal pons", slice: "caudal pons", lv: "cp", uni: false,
    vessel: "Basilar artery (mid-basilar occlusion), or the paramedian branches on both sides.",
    cause: "Basilar artery thrombosis or embolism (most common), pontine haemorrhage, osmotic demyelination (central pontine myelinolysis after rapid correction of hyponatraemia), trauma and tumour. A similar de-efferented state can result from severe peripheral disease (Guillain-Barré syndrome, ALS), but that is not a pontine lesion.",
    area: "Both halves of the basis pontis: the corticospinal and corticobulbar tracts on both sides, the pontine nuclei and transverse pontine fibres, and often the abducens fascicles. The dorsal tegmentum, including the ascending reticular activating system, is spared, so consciousness is preserved; the midbrain (vertical gaze and lid elevation) is spared.",
    motor: "Quadriplegia with anarthria: bilateral paralysis of the face, jaw, tongue and pharynx (bilateral corticobulbar loss), so the patient cannot speak or swallow. Vertical eye movements and blinking are preserved and are the only way to communicate. Horizontal gaze is often lost. Flaccid at first, then spastic with hyperreflexia and bilateral Babinski signs.",
    sens: "Usually preserved, because the medial lemniscus and spinothalamic tract lie dorsally in the tegmentum; they may be partly affected.",
    other: "The patient is fully awake and aware, with intact cognition and normal sleep-wake cycles, and is easily mistaken for coma or a vegetative state. Classic form: only vertical eye movements and blinking; incomplete form: some other voluntary movement; total form: no eye movement either. Breathing may continue (medullary centres), but airway protection is lost and aspiration is a major risk. Basilar occlusion often has a prodrome of dizziness, diplopia, dysarthria or fluctuating weakness, and needs urgent recanalisation.",
    exam: ["Before assuming coma, ask the patient to look up, look down and blink (for example once for yes, twice for no).", "Horizontal eye movements and the oculocephalic reflex: often absent.", "Strength, tone, reflexes and plantar responses in all four limbs; jaw jerk and gag reflex.", "Sensation in all limbs, using eye or blink responses as the answer.", "Airway, breathing and swallow; EEG shows a reactive, near-normal background, unlike coma."],
    img: "Urgent CT with CT angiography (or MR angiography) for basilar artery occlusion; a hyperdense basilar artery may be seen on plain CT. MRI with DWI shows bilateral ventral pontine infarction; in osmotic demyelination, a central (trident-shaped) pontine T2 lesion.",
    hit: { lcst: "f", acst: "f", cb: "f", pcb: "f", "cn6|Abducens nerve fascicles": "f", ml: "p", rub: "p" },
    ov: () => '<path d="M100,100 L116,100 L118,92 L136,94 C152,104 164,122 166,144 L162,180 L100,180 Z"/>'
  },
  {
    id: "les:lm", n: "Lateral medullary syndrome", aka: "Wallenberg syndrome \u00b7 PICA syndrome (posterior inferior cerebellar artery) \u00b7 dorsolateral (posterolateral) medullary syndrome",
    grp: "brain", badge: "Brainstem stroke", where: "rostral medulla", slice: "rostral medulla", lv: "rm", uni: true,
    vessel: "Intracranial vertebral artery (most often) or posterior inferior cerebellar artery (PICA).",
    cause: "Ischaemic stroke from occlusion of the intracranial vertebral artery (the most common culprit) or of the PICA: atherothrombosis, cervical artery dissection (especially in younger patients after neck trauma or manipulation) and cardioembolism. Rarely haemorrhage, demyelination or tumour.",
    area: "Dorsolateral medulla on one side: the spinal trigeminal nucleus and tract, nucleus ambiguus, vestibular nuclei, inferior cerebellar peduncle (with the spinocerebellar fibres entering it), the spinothalamic tract (spinal lemniscus) and the descending sympathetic fibres of the lateral reticular formation. The solitary nucleus and tract are sometimes involved. The medial structures (pyramid, medial lemniscus, hypoglossal nucleus and nerve) are spared.",
    motor: "Strength is preserved because the pyramid is spared. Ipsilateral palatal, pharyngeal and vocal cord weakness (nucleus ambiguus, CN IX and X): dysphagia, hoarseness, dysarthria, absent gag reflex and a uvula that deviates away from the lesion. Ipsilateral limb ataxia and dysmetria, with falling or lateropulsion toward the lesion side (inferior cerebellar peduncle and vestibular nuclei).",
    sens: "Ipsilateral loss of pain and temperature on the face (spinal trigeminal nucleus and tract) combined with contralateral loss of pain and temperature on the body and limbs (spinothalamic tract): the classic crossed pattern. Vibration and proprioception are spared because the medial lemniscus is intact.",
    other: "Ipsilateral Horner syndrome (ptosis, miosis, anhidrosis) from the descending sympathetic fibres; vertigo, nausea, vomiting, nystagmus and oscillopsia from the vestibular nuclei; intractable hiccups; reduced taste if the solitary tract is involved. Aspiration is the main early danger. Opalski syndrome is a variant with ipsilateral hemiparesis, from involvement of the corticospinal fibres after they have crossed.",
    exam: ["Pinprick and temperature on the face, then on the body: loss on the lesion side of the face and on the opposite side of the body. The corneal reflex may be reduced on the lesion side.", "Palate and voice: ask for \u201cahh\u201d (the uvula deviates away from the lesion), listen for hoarseness, test the gag reflex, and do a bedside swallow screen before any oral intake because of the aspiration risk.", "Eyes: look for ptosis, miosis (more obvious in the dark) and anhidrosis (Horner syndrome) and for nystagmus; the HINTS exam (head impulse, nystagmus, test of skew) separates central from peripheral vertigo.", "Cerebellar tests on the lesion side: finger-to-nose and heel-to-shin; watch sitting balance and gait for veering or falling toward the lesion (lateropulsion).", "Confirm that strength, vibration and proprioception are normal, which separates this from medial medullary syndrome."],
    img: "MRI with diffusion-weighted imaging (DWI): a posterior fossa infarct can be missed in the first 24 to 48 hours, so repeat it if suspicion stays high. CT or MR angiography of the vertebral arteries and PICA to look for dissection or occlusion.",
    hit: { cn5: "f", sl: "f", dsc: "f", cun: "f", "cn9|Nucleus ambiguus": "f", "cn10|Nucleus ambiguus": "f", "cn8|Inferior vestibular nucleus": "f", "cn8|Medial vestibular nucleus": "p", "cn9|Nucleus tractus solitarius": "p", vst: "p", vsc: "p", rub: "p" },
    ov: () => '<path d="M126,36 L200,36 L200,134 L164,134 L164,110 L138,110 L136,84 L128,64 Z"/>'
  },
  {
    id: "les:mm", n: "Medial medullary syndrome", aka: "Dejerine syndrome (D\u00e9j\u00e9rine anterior bulbar syndrome) \u00b7 inferior alternating hemiplegia \u00b7 hypoglossal alternating hemiplegia",
    grp: "brain", badge: "Brainstem stroke", where: "rostral medulla", slice: "rostral medulla", lv: "rm", uni: true,
    vessel: "Anterior spinal artery (from the vertebral arteries) or paramedian branches of the vertebral artery.",
    cause: "Infarction of the paramedian medulla from occlusion of the anterior spinal artery or of the vertebral artery and its paramedian branches: atherothrombosis, vertebral artery dissection, small vessel disease or embolism. Both sides can be involved because the anterior spinal artery supplies both.",
    area: "Paramedian medulla on one side: the pyramid (corticospinal fibres), the medial lemniscus and the hypoglossal nerve rootlets running between the pyramid and the olive. The hypoglossal nucleus, medial longitudinal fasciculus and tectospinal tract are affected only if the lesion extends dorsally. The lateral structures (spinal trigeminal, nucleus ambiguus, spinothalamic tract, inferior cerebellar peduncle) are spared.",
    motor: "Contralateral hemiparesis of the arm and leg with upper motor neuron signs (the pyramidal fibres have not yet crossed), sparing the face. Ipsilateral tongue weakness: the tongue deviates toward the lesion on protrusion (hypoglossal lower motor neuron lesion), with atrophy and fasciculations later. \u201cAlternating\u201d means cranial nerve signs on the lesion side and limb signs on the opposite side.",
    sens: "Contralateral loss of vibration, proprioception and fine touch of the trunk and limbs (medial lemniscus), sparing the face. Pain and temperature are spared because the spinothalamic tract lies laterally.",
    other: "No Horner syndrome, dysphagia or ataxia, because the lateral structures are intact. Upbeat or downbeat nystagmus can occur if the MLF is involved. Bilateral infarction (the \u201cheart appearance\u201d sign on MRI) causes quadriparesis with tongue paralysis and can resemble locked-in syndrome. Not to be confused with Dejerine-Roussy syndrome (thalamic pain) or Dejerine-Sottas disease.",
    exam: ["Test strength in the arms and legs on both sides (MRC scale) and confirm the face is normal; check tone, reflexes and the plantar response on the weak side.", "Ask the patient to stick out the tongue: it deviates toward the lesion; look for wasting and fasciculations.", "Vibration (128 Hz tuning fork) and joint position sense: reduced on the weak side; Romberg may be positive.", "Confirm that pinprick and temperature are normal on the face and body, and that swallowing, voice and the gag reflex are intact.", "Check eye movements for upbeat or downbeat nystagmus if the lesion may extend dorsally."],
    img: "MRI with DWI: a paramedian medullary infarct (heart-shaped when bilateral). CT or MR angiography of the vertebral arteries to look for dissection, stenosis or occlusion.",
    hit: { lcst: "f", ml: "f", "cn12|Hypoglossal nerve rootlets": "f", mlf: "p", tect: "p" },
    ov: () => '<path d="M100,66 L120,66 L120,150 L134,150 L134,176 L100,176 Z"/>'
  }
];

function lesionOverlay(L) {
  const shape = L.ov();
  if (FB[L.lv]) return `<g clip-path="url(#clip-${L.lv})">${shape}</g>`;   // the cortex view shows one hemisphere: no mirroring or side labels
  const inner = L.uni && LSIDE === "L" ? `<g transform="translate(200,0) scale(-1,1)">${shape}</g>` : shape;
  const mirrored = L.uni ? "" : `<g transform="translate(200,0) scale(-1,1)">${shape}</g>`;   // bilateral lesions are drawn on both halves
  return `<g clip-path="url(#clip-${L.lv})">${inner}${mirrored}</g>
    <text class="lb lov-side" x="32" y="186">Left side</text><text class="lb lov-side" x="168" y="186">Right side</text>`;
}

// A lesion's hit map is keyed by tract id, or by "id|name" to single out one structure that shares an id (e.g. the nucleus ambiguus under CN IX)
const hitName = e => ((e.querySelector("title") || {}).textContent || "").replace(/ \((Left|Right).*$/, "");
const hitOf = (L, id, name) => (name !== undefined && L.hit[id + "|" + name]) || L.hit[id];

function lesionPaint(L) {
  document.querySelectorAll(".lov").forEach(g => { g.innerHTML = ""; });
  document.querySelectorAll(".sh.hit, .sh.part, .st.hit, .st.part").forEach(e => e.classList.remove("hit", "part"));
  document.querySelectorAll(".blk.lesion-lv").forEach(b => b.classList.remove("lesion-lv"));
  if (!L) { applyFilter(); return; }
  const g = document.querySelector(`#s-${L.lv} .lov`);
  if (g) g.innerHTML = lesionOverlay(L);
  const side = e => !L.uni || e.dataset.side === LSIDE;
  document.querySelectorAll(`#s-${L.lv} .lg`).forEach(e => {
    const h = hitOf(L, e.dataset.id, (e.querySelector(".lab") || {}).textContent);
    e.classList.toggle("on", !!h);
    e.classList.toggle("dim", !h);
    if (h) e.classList.remove("fo");   // a filter such as "Lesions" must not fade the labels of involved structures
  });
  document.querySelectorAll(`#s-${L.lv} .ar, #s-${L.lv} .dec-path, #s-${L.lv} .dec-marker`).forEach(e => {
    if (L.hit[e.dataset.id]) e.classList.remove("fo");
  });
  document.querySelectorAll(`#s-${L.lv} .sh`).forEach(e => {
    const h = hitOf(L, e.dataset.id, hitName(e));
    if (h && side(e)) { e.classList.remove("dim", "fo"); e.classList.add("on", h === "f" ? "hit" : "part"); }
    else { e.classList.remove("on"); e.classList.add("dim"); }
  });
  document.querySelectorAll(`#s-${L.lv} .ar`).forEach(e => e.classList.toggle("on", !!L.hit[e.dataset.id] && side(e)));
  document.querySelectorAll(`#s-${L.lv} .st`).forEach(e => {   // cortical areas and nuclei of the forebrain views
    const h = L.hit[e.dataset.id];
    e.classList.toggle("on", !!h);
    e.classList.toggle("dim", !h);
    if (h) e.classList.add(h === "f" ? "hit" : "part");
  });
  // a lesion lives on one slice: switch the tract highlighting off everywhere else
  document.querySelectorAll(".sec").forEach(sec => {
    if (sec.dataset.slice === L.lv) return;
    sec.querySelectorAll(".on").forEach(e => { e.classList.remove("on"); e.classList.add("dim"); });
    sec.classList.remove("has-active", "has-active-dec");
    sec.classList.toggle("filtered-out", filterActiveOnly && !!sel);
    const sb = sec.querySelector(".sec-side-badge");
    if (sb) sb.textContent = "";
  });
  document.querySelectorAll(".blk").forEach(b => { if ((SEC_TO_LONG[L.lv] || []).includes(b.dataset.s)) b.classList.add("lesion-lv"); });
  applyFilter();   // re-apply filter fading now that the lit set is final (the lesion's own structures are exempt)
}

function lesInfo(L) {
  const row = (k, v) => `<dt>${k}</dt><dd>${v}</dd>`;
  const pills = Object.entries(L.hit).map(([key, h]) => {
    const [id, nm] = key.split("|");
    const t = T.find(x => x.id === id);
    const tip = h === "f" ? "Damaged" : "May be partly affected", part = h === "p" ? " (partly)" : "";
    if (ST[id]) return `<button type="button" class="rel-pill" data-jump-id="${id}" title="${tip}">● ${ST[id][0]}${part}</button>`;
    return t ? `<button type="button" class="rel-pill" data-jump-id="${t.id}" title="${tip}"><span class="dot" style="background:${t.col}"></span>${nm || t.n}${part}</button>` : "";
  }).join("");
  const flat = !!FB[L.lv];   // cortex view: one hemisphere, so no side toggle
  const sideRow = L.uni && !flat ? `<div class="les-side">Lesion side shown:
      <button type="button" class="sdb${LSIDE === "L" ? " on" : ""}" data-sd="L">Left half</button>
      <button type="button" class="sdb${LSIDE === "R" ? " on" : ""}" data-sd="R">Right half</button></div>` : "";
  return `
    <div class="info-top">
      <div class="info-title-wrap">
        <h2 style="--c:#d0242a">${L.n}</h2>
        <span class="bdg" style="background:#d0242a">${L.badge || "Spinal cord lesion"}</span>
        <span class="bdg-dec">${L.uni ? "Unilateral" : "Bilateral"}</span>
      </div>
      ${sel ? `<button type="button" class="unpin-btn" id="unpin-btn">Unpin ✕</button>` : ""}
    </div>
    ${L.aka ? `<div class="les-aka">Also called: ${L.aka}</div>` : ""}
    ${sideRow}
    <p class="les-legend">Shown on the <strong>${L.slice || "cervical spinal cord"}</strong> slice: the shaded area is the ${flat ? "arterial territory" : "lesion"}, <span class="lg-hit">red</span> ${flat ? "areas" : "tracts"} are damaged, <span class="lg-part">amber</span> ${flat ? "areas" : "tracts"} may be partly affected, and the rest are dimmed.</p>
    <dl>
      ${row("Cause", L.cause)}${L.vessel ? row("Blood supply", L.vessel) : ""}${row("Affected", L.area)}${row("Motor", L.motor)}${row("Sensory", L.sens)}${row("Other signs", L.other)}
      ${row("How to check", "<ul>" + L.exam.map(x => `<li>${x}</li>`).join("") + "</ul>")}${row("Imaging", L.img)}
    </dl>
    <div class="related-pills"><span style="font-size:11px;color:var(--mut);align-self:center">${flat ? "Areas and tracts involved:" : "Tracts involved:"}</span>${pills}</div>`;
}

// ---- Sidebar: built once, then filtered in place (search + category chip + level) ----
const TAG = { dc: "s", ast: "s", lst: "s", ml: "s", sl: "s", tl: "s", ll: "s", cb: "m", lcst: "m", acst: "m", vst: "m", prst: "m", mrst: "m", rub: "m", crb: "m", tect: "m", ns: "m", mlf: "m", dsc: "c", vsc: "c", cun: "c", pcb: "c", olcb: "c", dtc: "c", ctt: "c" };
T.forEach(t => { t.tag = TAG[t.id] || "n"; });   // s sensory, m motor, c cerebellar, n cranial nerve

const REGION = {};
FB.cx.forEach(e => { REGION[e[0]] = "Cortex"; });
FB.th.forEach(e => { REGION[e[0]] = ["CAU", "PUT", "GPE", "GPI", "STN", "SN"].includes(e[0]) ? "Basal ganglia" : "Thalamus"; });
FB.cbl.forEach(e => { REGION[e[0]] = "Cerebellum"; });

const LEVEL_NAMES = { cx: "Cerebral cortex", th: "Thalamus & basal ganglia", rmb: "Rostral midbrain", cmb: "Caudal midbrain", rp: "Rostral pons", cp: "Caudal pons", cbl: "Cerebellum", rm: "Rostral medulla", mm: "Mid medulla", cm: "Caudal medulla", c: "Cervical spinal cord", lum: "Lumbar spinal cord" };
$("#level-filter").innerHTML = `<option value="">Present at any level</option>` + SEC.map(([k]) => `<option value="${k}">${LEVEL_NAMES[k] || k}</option>`).join("");

const F = { q: "", k: "", l: "" };
let sideBuilt = false;

function buildSidebar() {
  let html = "";
  G.forEach(([groupName, dCode]) => {
    html += `<h3><span>${groupName}</span><span></span></h3>`;
    html += T.filter(t => t.d === dCode).map(t =>
      `<button class="it" data-id="${t.id}" style="--c:${t.col}">
        <span class="dot" style="background:${t.col}"></span>
        <span class="it-text">${t.n}</span>
        <span class="dr">${AR[dCode]}</span>
      </button>`).join("");
  });
  const lesItem = l =>
    `<button class="it les-it" data-id="${l.id}" style="--c:#d0242a">
      <span class="dot" style="background:#d0242a"></span>
      <span class="it-text">${l.n}<span class="it-sub">${l.uni ? "unilateral" : "bilateral"} · ${l.where || "cervical cord"}</span></span>
      <span class="dr">⚠</span>
    </button>`;
  html += `<h3><span>Spinal cord lesions</span><span></span></h3>` + LES.filter(l => !l.grp).map(lesItem).join("");
  html += `<h3><span>Cerebral strokes</span><span></span></h3>` + LES.filter(l => l.grp === "cerebral").map(lesItem).join("");
  html += `<h3><span>Brainstem strokes</span><span></span></h3>` + LES.filter(l => l.grp === "brain").map(lesItem).join("");
  html += `<h3><span>Brain structures &amp; nuclei</span><span></span></h3>`;
  html += Object.entries(ST).map(([id, [name]]) =>
    `<button class="it st-it" data-id="${id}" style="--c:var(--acc)">
      <span class="dot" style="background:var(--acc)"></span>
      <span class="it-text">${name}<span class="it-sub">${REGION[id] || "Structure"}</span></span>
      <span class="dr">●</span>
    </button>`).join("");
  $("#side").innerHTML = html;
}

function applyFilter() {
  const terms = F.q.toLowerCase().split(/\s+/).filter(Boolean), ok = new Set();
  T.forEach(t => {
    if (!t.blob) t.blob = (`${t.n} ${t.id} ${[t.o, t.c, t.x, t.t, t.f, t.l].join(" ")} ${getSubNucleiForTract(t).join(" ")}`).toLowerCase();
    if ((!F.k || t.tag === F.k) && (!F.l || getSlicesForItem(t.id).includes(F.l)) && terms.every(w => t.blob.includes(w))) ok.add(t.id);
  });
  const nt = ok.size, on = !!(F.q || F.k || F.l), sOn = !!F.q && !F.k && !F.l;
  let nl = 0;   // lesion syndromes: shown under "All" and "Lesions", searched by text, present at the cord level only
  LES.forEach(l => {
    if (!l.blob) l.blob = `${l.n} ${l.aka || ""} ${[l.cause, l.vessel || "", l.area, l.motor, l.sens, l.other, l.img].join(" ")} ${l.exam.join(" ")}`.toLowerCase();
    if ((!F.k || F.k === "l") && (!F.l || F.l === l.lv) && terms.every(w => l.blob.includes(w))) { ok.add(l.id); nl++; }
  });
  let ns = 0;   // structures are searched only by text (not by category chip or level)
  Object.entries(ST).forEach(([id, v]) => {
    if (sOn && terms.every(w => `${v[0]} ${v[1]} ${id} ${REGION[id] || ""}`.toLowerCase().includes(w))) { ok.add(id); ns++; }
  });
  document.querySelectorAll("#side .it").forEach(e => { e.hidden = !ok.has(e.dataset.id); });
  document.querySelectorAll("#side h3").forEach(h => {
    let e = h.nextElementSibling, n = 0;
    while (e && e.classList.contains("it")) { if (!e.hidden) n++; e = e.nextElementSibling; }
    h.hidden = !n;
    h.lastElementChild.textContent = n;
  });
  // fade tracts that do not match, everywhere they are drawn
  document.querySelectorAll(".sh, .lg, .ar, .dec-path, .dec-marker").forEach(e => {
    e.classList.toggle("fo", on && !ok.has(e.dataset.id));
  });
  // the filter only fades the right-hand panels while nothing is selected: a pinned item switches it off entirely,
  // and a hover preview keeps its own highlighted structures lit
  if (sel) document.querySelectorAll(".fo").forEach(e => e.classList.remove("fo"));
  else if (hov) document.querySelectorAll(".on.fo").forEach(e => e.classList.remove("fo"));
  $("#filter-count").textContent = on
    ? `${nt} of ${T.length} shown` + (ns ? ` + ${ns} structure${ns > 1 ? "s" : ""}` : "") + (nl ? ` + ${nl} lesion${nl > 1 ? "s" : ""}` : "") + (nt || ns || nl ? "" : " (no matches)")
    : `${T.length} tracts and nerves · ${LES.length} lesion syndromes`;
}

function renderSidebar() {
  if (!sideBuilt) { buildSidebar(); sideBuilt = true; }
  applyFilter();
  document.querySelectorAll("#side .it").forEach(e => e.classList.toggle("sel", e.dataset.id == sel));
}

// Schematic rows: [row key, margin label, top, bottom, slice it opens, block left, block right] (y in 0-520 units)
const LV = [
  ["cx", "Cortex", 8, 44, "cx", 83, 223],
  ["bg", "Basal ganglia", 54, 84, "th", 153, 223],
  ["th", "Thalamus", 92, 120, "th", 93, 213],
  ["rmb", "Rostral midbrain", 134, 160, "rmb", 93, 213],
  ["cmb", "Caudal midbrain", 160, 184, "cmb", 93, 213],
  ["rp", "Rostral pons", 192, 216, "rp", 93, 213],
  ["cp", "Caudal pons", 216, 240, "cp", 93, 213],
  ["rm", "Rostral medulla", 256, 288, "rm", 97, 209],
  ["mm", "Mid medulla", 302, 334, "mm", 101, 205],
  ["cm", "Caudal medulla", 348, 378, "cm", 105, 201],
  ["cd", "Cervical cord", 404, 436, "c", 111, 195],
  ["cs", "Lumbar cord", 470, 502, "lum", 111, 195]
];
const Y0 = { ...Y };
// Route levels (the keys of Y) by name, and the schematic rows each one covers
const LEVEL_LONG = { cx: "Cortex", olf: "Olfactory bulb", bg: "Basal ganglia", th: "Thalamus", mb: "Midbrain", po: "Pons", cb: "Cerebellum", rm: "Rostral medulla", mm: "Mid medulla", cm: "Caudal medulla", cd: "Cervical cord", cs: "Lumbar cord" };
const LEVEL_ROWS = { mb: ["rmb", "cmb"], po: ["rp", "cp"], olf: ["bg"], cb: ["cbl"] };

function layout() {
  const v = $("#dsv"), w = v.clientWidth, h = v.clientHeight;
  if (!w || !h) return;
  // the drawing stretches to the panel's shape, flattening down to about half height in the short 3D + 2D split
  const H = Math.max(260, h * DSV_W / w), K = (H - DSV_TOP) / 520;
  for (const k in Y0) Y[k] = Y0[k] * K;
  v.setAttribute("viewBox", `0 0 ${DSV_W} ${H}`);
  v.innerHTML = `
    <text class="dsv-col" x="${X.L}" y="10">Left · ipsi</text>
    <text class="dsv-col" x="${X.R}" y="10">Right · contra</text>
    <g transform="translate(0,${DSV_TOP})">
      ${LV.map(([k, n, a, b, s, x1, x2]) =>
        `<rect class="blk" data-s="${s}" data-row="${k}" x="${x1}" y="${a * K}" width="${x2 - x1}" height="${(b - a) * K}" rx="8"><title>${n}</title></rect>` +
        `<text class="bl gut" data-row="${k}" x="64" y="${(a + b) / 2 * K + 2.5}">${n}</text>`).join("")}
      <rect class="blk" data-s="cbl" data-row="cbl" x="221" y="${214 * K}" width="38" height="${52 * K}" rx="8"><title>Cerebellum</title></rect>
      <text class="bl" x="240" y="${244 * K}">Cb</text>
      <line class="dsv-mid" x1="${MID}" y1="0" x2="${MID}" y2="${510 * K}"/>
      <g id="fl"></g>
    </g>`;
  paint();
}

// Short start / crossing / end lines for the route card (the full text is in the info panel)
const ROUTE = {
  dc: ["Dorsal root ganglion cells (touch, vibration, proprioception)", "Not in the cord: the second-order fibres cross in the mid medulla (internal arcuate fibres)", "Nucleus gracilis and nucleus cuneatus"],
  ast: ["Dorsal horn, laminae I and V–VII", "Anterior white commissure, 1–2 segments above entry", "VPL thalamus, then S1"],
  lst: ["Dorsal horn, laminae I and V", "Anterior white commissure, 1–2 segments above entry", "VPL thalamus, then S1, insula and cingulate cortex"],
  dsc: ["Clarke's nucleus (C8–L3)", "Uncrossed", "Same-side spinocerebellum, through the inferior cerebellar peduncle"],
  vsc: ["Spinal border cells, lumbosacral cord", "Twice: in the cord, then back again inside the cerebellum", "Same-side spinocerebellum, through the superior cerebellar peduncle"],
  cun: ["Accessory cuneate nucleus, medulla", "Uncrossed", "Same-side spinocerebellum, through the inferior cerebellar peduncle"],
  ml: ["Nucleus gracilis and nucleus cuneatus", "Sensory decussation (internal arcuate fibres), mid medulla", "VPL thalamus, then S1"],
  sl: ["Opposite dorsal horn (spinothalamic fibres)", "Already crossed in the cord", "VPL and intralaminar thalamus, reticular formation, tectum"],
  tl: ["Spinal and principal trigeminal nuclei", "Medulla and pons (a small dorsal tract stays uncrossed)", "VPM thalamus, then the S1 face area"],
  ll: ["Cochlear nuclei and superior olive", "Mostly in the trapezoid body, caudal pons (the pathway is bilateral)", "Inferior colliculus, then MGN and A1"],
  cb: ["Motor cortex, face area", "Bilateral: fibres cross at the level of each cranial nerve nucleus", "Motor nuclei of CN V, VII and IX–XII"],
  lcst: ["M1, premotor cortex and S1", "Pyramidal decussation, caudal medulla (about 90% of fibres)", "Lateral ventral horn: motor neurons of distal limb muscles"],
  acst: ["M1 and premotor cortex (about 10% of fibres)", "Segmentally, in the anterior white commissure", "Medial ventral horn: axial and proximal muscles on both sides"],
  vst: ["Lateral vestibular (Deiters) nucleus", "Uncrossed", "Extensor (antigravity) motor neurons along the whole cord"],
  prst: ["Pontine reticular formation", "Uncrossed", "Axial and proximal extensor motor neurons"],
  mrst: ["Medullary reticular formation", "Mostly uncrossed (partly bilateral)", "Interneurons for flexors, spinal reflexes and autonomic control"],
  rub: ["Red nucleus, rostral midbrain", "Ventral tegmental decussation, midbrain", "Cervical cord: upper-limb flexor motor neurons"],
  ns: ["Substantia nigra pars compacta", "Uncrossed", "Caudate and putamen"],
  mlf: ["Vestibular and abducens nuclei, riMLF", "Ascending fibres cross at the abducens and vestibular level", "Nuclei of CN III, IV and VI; cervical motor neurons"],
  cn1: ["Olfactory epithelium, relayed in the olfactory bulb", "No thalamic relay; a few fibres cross in the anterior commissure", "Piriform cortex, amygdala and entorhinal cortex"],
  cn2: ["Retinal ganglion cells", "Optic chiasm (fibres from the nasal retina)", "LGN, then V1 (and the pretectum for the light reflex)"],
  cn3: ["Oculomotor and Edinger-Westphal nuclei, midbrain", "Uncrossed (except the superior rectus subnucleus)", "Eye muscles, levator palpebrae, pupil and ciliary muscle"],
  cn4: ["Trochlear nucleus, caudal midbrain", "Completely, in the superior medullary velum (exits dorsally)", "Superior oblique of the opposite eye"],
  cn5: ["Trigeminal ganglion (sensory) and motor nucleus", "Second-order fibres cross as the trigeminal lemniscus", "Trigeminal nuclei from pons to upper cord; muscles of mastication"],
  cn6: ["Abducens nucleus, caudal pons", "Uncrossed (its interneurons cross into the MLF)", "Lateral rectus"],
  cn7: ["Facial motor nucleus, caudal pons", "Uncrossed", "Muscles of facial expression, lacrimal and salivary glands; taste in"],
  cn8: ["Spiral and vestibular ganglia", "Cochlear pathway crosses in the trapezoid body", "Cochlear and vestibular nuclei"],
  cn9: ["Nucleus ambiguus, inferior salivatory and solitary nuclei", "Uncrossed", "Stylopharyngeus and parotid; afferents from pharynx and carotid"],
  cn10: ["Nucleus ambiguus, dorsal motor nucleus of X, solitary nucleus", "Uncrossed", "Pharynx, larynx, heart, lungs and gut"],
  cn11: ["Spinal accessory nucleus, C1–C5", "Uncrossed", "Sternocleidomastoid and trapezius"],
  cn12: ["Hypoglossal nucleus, medulla", "Uncrossed", "Tongue muscles"],
  pcb: ["Cerebral cortex, relayed in the pontine nuclei", "Transverse pontine fibres, basis pontis", "Opposite cerebellar hemisphere, through the middle cerebellar peduncle"],
  olcb: ["Inferior olivary nucleus", "In the medulla, into the opposite inferior cerebellar peduncle", "Opposite cerebellar cortex, as climbing fibres"],
  dtc: ["Dentate and interposed nuclei", "Decussation of the superior cerebellar peduncle, caudal midbrain", "Opposite red nucleus and VL thalamus, then motor cortex"],
  crb: ["Motor and premotor cortex", "Uncrossed", "Red nucleus"],
  tect: ["Superior colliculus", "Dorsal tegmental decussation, midbrain", "Upper cervical cord and brainstem gaze centres"],
  ctt: ["Parvocellular red nucleus and midbrain tegmentum", "Uncrossed (the olive's output crosses to the cerebellum)", "Inferior olive on the same side, wrapped as the amiculum"]
};

// A tract's route parsed from its `p` string: points in order, the levels it passes and where it crosses the midline
function parseRoute(t) {
  const pts = t.p.trim().split(/\s+/).map(q => { const [s, l] = q.split(":"); return { s, l }; });
  const levels = pts.map(p => p.l).filter((l, i, a) => i === 0 || l !== a[i - 1]);
  const crossings = [];
  pts.forEach((p, i) => { if (i && ((p.s === "L" && pts[i - 1].s === "R") || (p.s === "R" && pts[i - 1].s === "L"))) crossings.push(i); });
  return { pts, levels, crossings };
}

const lvChip = l => `<span class="rc-lv">${LEVEL_LONG[l] || l}</span>`;
const DIR_WORD = { a: "Ascending", d: "Descending", b: "Both directions", n: "Cranial nerve" };

// The route card under the schematic: start, crossing and end for a tract; a short note for anything else
function routeCardHTML(c) {
  const t = T.find(x => x.id === c);
  if (t) {
    const { pts, levels, crossings } = parseRoute(t);
    const [from, cross, to] = ROUTE[t.id] || [t.o, t.x, t.t];
    return `
      <div class="rc-head"><span class="dot" style="background:${t.col}"></span><strong>${t.n}</strong><span class="rc-dir">${AR[t.d]} ${DIR_WORD[t.d]}</span></div>
      <dl class="rc-rows" style="--c:${t.col}">
        <dt><span class="rc-ico start"></span>Starts</dt><dd>${lvChip(pts[0].l)} ${from}</dd>
        <dt><span class="rc-ico cross">✕</span>Crosses</dt><dd>${crossings.map(i => lvChip(pts[i].l)).join(" ")} ${cross}</dd>
        <dt><span class="rc-ico end"></span>Ends</dt><dd>${lvChip(pts[pts.length - 1].l)} ${to}</dd>
      </dl>
      <div class="rc-route"><span>Route</span> ${levels.map(l => LEVEL_LONG[l] || l).join(" → ")}</div>`;
  }
  const L = LES.find(l => l.id === c);
  if (L) return `<div class="rc-head"><strong>${L.n}</strong></div><p class="rc-note">Lesion level: <span class="rc-lv les">${LEVEL_NAMES[L.lv] || L.lv}</span>, marked in red on the schematic. The tracts it damages are listed in the info panel.</p>`;
  if (ST[c]) {
    const rel = T.filter(x => (TG[x.id] || []).includes(c));
    return `<div class="rc-head"><strong>${ST[c][0]}</strong></div><p class="rc-note">${rel.length ? "A structure, not a pathway: pick a connected tract to trace its route." : "A structure, not a pathway."}</p>` +
      (rel.length ? `<div class="related-pills">${rel.map(x => `<button type="button" class="rel-pill" data-jump-id="${x.id}"><span class="dot" style="background:${x.col}"></span>${x.n}</button>`).join("")}</div>` : "");
  }
  return `<p class="rc-note">Point at or select a tract or cranial nerve to trace its route: where it <strong>starts</strong> (<span class="rc-ico start"></span>), where it <strong>crosses</strong> the midline (<span class="rc-ico cross">✕</span>) and where it <strong>ends</strong> (<span class="rc-ico end"></span>).</p>`;
}

let shown;
let lastBrainSel; // last pinned item pushed to the 3D brain (avoids re-sending on every hover)
let currentPathwaySlices = [];
let currentStepIdx = 0;

function getSlicesForItem(c) {
  if (!c) return [];
  const lesion = LES.find(l => l.id === c);
  if (lesion) return [lesion.lv];
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
  const c = sel || hov;   // highlighted item: pinned one wins, otherwise the hovered one
  const S0 = ST[c];
  const LS = LES.find(l => l.id === c);   // a lesion syndrome is highlighted through the tracts it damages
  const A = new Set(LS ? Object.keys(LS.hit).map(k => k.split("|")[0]) : S0 ? T.filter(t => (TG[t.id] || []).includes(c)).map(t => t.id) : c ? [c] : []);
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
      const o = id == c || (!S0 && (TG[c] || []).includes(id)) || (!!LS && A.has(id));   // a cerebral stroke lights the cortical areas it hits
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
    secEl.classList.toggle("filtered-out", filterActiveOnly && !!sel && !secHasActive);
  });

  document.querySelectorAll(".it").forEach(e => e.classList.toggle("sel", e.dataset.id == sel));
  lesionPaint(LS);

  // 2D schematic: the tract's route with start / end markers and crossing nodes, its levels in bold, and the route card
  const flEl = $("#fl");
  const onPath = new Set();
  if (flEl) {
    if (activeTract) {
      const { pts, levels, crossings } = parseRoute(activeTract);
      const P = pts.map(p => ({ ...p, x: X[p.s], y: Y[p.l] }));
      const col = activeTract.col, both = activeTract.d === "b";
      // a marker's tag sits to its right, or to its left near the right edge
      const tag = (p, text, dy) => `<text class="fl-tag" x="${p.x > 200 ? p.x - 8 : p.x + 8}" y="${p.y + dy}" text-anchor="${p.x > 200 ? "end" : "start"}">${text}</text>`;
      const first = P[0], last = P[P.length - 1];
      let svgFlow = `<polyline class="flow ${activeTract.d}" stroke="${col}" style="color:${col}" points="${P.map(p => `${p.x},${p.y}`).join(" ")}"/>`;
      crossings.forEach(i => {
        const mx = (P[i - 1].x + P[i].x) / 2, my = (P[i - 1].y + P[i].y) / 2;
        svgFlow += `<g class="dec-mark"><circle class="dec-node" cx="${mx}" cy="${my}" r="5"/><text class="dec-x" x="${mx}" y="${my + 2.3}">✕</text><title>Crosses: ${(ROUTE[activeTract.id] || [])[1] || activeTract.x}</title></g>`;
      });
      svgFlow += `<circle class="fl-mark ${both ? "end" : "start"}" cx="${first.x}" cy="${first.y}" r="4.6" style="--c:${col}"/>` + tag(first, both ? "end" : "start", 2.5);
      svgFlow += `<circle class="fl-mark end" cx="${last.x}" cy="${last.y}" r="4.6" style="--c:${col}"/>` + tag(last, "end", 2.5);
      flEl.innerHTML = svgFlow;
      levels.forEach(l => (LEVEL_ROWS[l] || [l]).forEach(r => onPath.add(r)));
    } else {
      flEl.innerHTML = "";
    }
  }
  document.querySelectorAll("#dsv [data-row]").forEach(e => e.classList.toggle("on-path", onPath.has(e.dataset.row)));
  const rc = $("#route-card");
  if (rc) rc.innerHTML = routeCardHTML(c);

  // Update 3D Brain Pathway & Slice Highlights
  const activeSlices = getSlicesForItem(sel);   // only a pinned item filters slices / drives the 3D view
  const selTract = T.find(x => x.id === sel);
  const selLes = LES.find(l => l.id === sel);
  if (brain3d && lastBrainSel !== sel) {
    lastBrainSel = sel;
    brain3d.setTractPathway(selTract || null);
    brain3d.highlightTractSlices(new Set(activeSlices));
    if (selLes) brain3d.setActiveSlice(selLes.lv);
  }

  currentPathwaySlices = activeSlices;
  const stepper = $("#pathway-stepper");
  const showAllBtn = $("#show-all-slices-btn");
  const statusEl = $("#grid-status");

  if (sel && activeSlices.length > 0) {
    stepper.classList.remove("hidden");
    showAllBtn.classList.toggle("hidden", !filterActiveOnly);
    const spotIdx = activeSlices.indexOf(spotlightSlice);
    if (spotIdx !== -1) currentStepIdx = spotIdx;
    else if (currentStepIdx >= activeSlices.length) currentStepIdx = 0;
    $("#step-indicator").textContent = `Slice ${currentStepIdx + 1} / ${activeSlices.length}`;
    statusEl.textContent = filterActiveOnly
      ? `Showing ${activeSlices.length} active slices for ${selTract ? selTract.n : selLes ? selLes.n : ST[sel][0]} · Click any slice to Spotlight`
      : `Highlighted across ${activeSlices.length} of ${SEC.length} levels`;
  } else {
    stepper.classList.add("hidden");
    showAllBtn.classList.add("hidden");
    statusEl.textContent = `Showing all ${SEC.length} anatomical levels — click any slice header or '⤢ Spotlight' to zoom in`;
  }

  // Update Inspector Card (#info)
  const k = sel || hov;
  const infoKey = (sel ? "S:" : "H:") + k + (LS && LS.uni ? LSIDE : "");   // hover preview and pinned view render differently (Unpin button)
  if (infoKey === shown) return;
  shown = infoKey;
  $("#info").scrollTop = 0;
  const i = T.find(x => x.id == k), s = ST[k];

  if (LS) {
    $("#info").style.setProperty("--c", "#d0242a");
    $("#info").innerHTML = lesInfo(LS);
    return;
  }

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
        Select any tract on the left to pull up only the slices where it is present. Hover over any tract, nerve or structure to preview it, and click to pin it. Click <strong>⤢ Spotlight</strong> on any slice to make it the largest zoomed view.
      </p>`;
  }
}

function selectItem(id) {
  sel = sel === id ? null : id;
  hov = null;
  currentStepIdx = 0;
  // no automatic Spotlight; only drop one that the pinned item's filter would hide
  if (sel && filterActiveOnly && spotlightSlice && !getSlicesForItem(sel).includes(spotlightSlice)) setSpotlightSlice(spotlightSlice, false);
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

// Clicking pins / unpins (hovering only previews, see below)
document.addEventListener("click", e => {
  if (e.target.closest("#quiz-stage") || e.target.closest(".modal-backdrop")) return;
  const sdb = e.target.closest(".sdb");
  if (sdb) {   // switch the side of a unilateral lesion
    LSIDE = sdb.dataset.sd;
    paint();
    return;
  }
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
// Hover previews whatever is under the pointer while nothing is pinned; once an item is pinned, only clicks change it
let hovTimer;
document.addEventListener("mouseover", e => {
  if (sel) return;
  if (e.target.closest("#quiz-stage, .modal-backdrop")) return;
  if (e.target.closest("#info, #route-card")) { clearTimeout(hovTimer); return; }   // keep the preview while the pointer is on it (to scroll or use its pills)
  const id = pick(e);
  clearTimeout(hovTimer);
  if (id) {
    if (id !== hov) { hov = id; paint(); }
  } else if (hov) {
    hovTimer = setTimeout(() => { if (!sel && hov) { hov = null; paint(); } }, 250);
  }
});

const searchInput = $("#search-input");
const searchClear = $("#search-clear");
const searchKbd = $("#search-kbd");

searchInput.addEventListener("input", () => {
  F.q = searchInput.value;
  searchClear.classList.toggle("hidden", !F.q);
  searchKbd.classList.toggle("hidden", !!F.q);
  applyFilter();
});

searchClear.addEventListener("click", () => {
  searchInput.value = "";
  F.q = "";
  searchClear.classList.add("hidden");
  searchKbd.classList.remove("hidden");
  applyFilter();
  searchInput.focus();
});

document.addEventListener("keydown", e => {
  const a = document.activeElement;
  if (e.key === "/" && !/INPUT|SELECT|TEXTAREA/.test(a.tagName)) {   // never steal "/" from a text field (e.g. the quiz answer box)
    e.preventDefault();
    searchInput.focus();
  } else if (e.key === "Escape") {
    const modal = document.querySelector(".modal-backdrop:not(.hidden)");   // an open dialog closes first
    if (modal) modal.querySelector(".modal-close")?.click();
    else if (a === searchInput && F.q) searchClear.click();
    else if (sel) selectItem(sel);
  }
});

$("#cat-tabs").addEventListener("click", e => {
  const btn = e.target.closest(".cat-tab");
  if (!btn) return;
  F.k = btn.dataset.cat;
  document.querySelectorAll(".cat-tab").forEach(b => b.classList.toggle("active", b === btn));
  applyFilter();
});

$("#level-filter").addEventListener("change", e => {
  F.l = e.target.value;
  applyFilter();
  const s = F.l && $("#s-" + F.l);
  if (s && !s.classList.contains("filtered-out")) {
    s.scrollIntoView({ behavior: "smooth", block: "center" });
    s.classList.add("fl");
    setTimeout(() => s.classList.remove("fl"), 1300);
  }
});

// Toolbar Controls
document.body.dataset.mode = currentMode;
document.body.dataset.lat = currentLat;

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

  // Question formats: identify a highlighted structure on a slice, clinical lesion questions, and function questions
  const SLICE_MODES = ["mcq", "type", "label"], LESION_MODES = ["lsx", "lsh", "sxl"], FUNC_MODES = ["sfn", "fns"];
  const MODE_TITLES = {
    mcq: "Multiple Choice", type: "Type the Name", label: "Label the Slice",
    lsx: "Lesion from Symptoms", lsh: "Lesion from Shading", sxl: "Symptoms of a Lesion",
    sfn: "Structure from Function", fns: "Function of a Structure"
  };

  // Quiz-only lesion data: a presentation that does not name the syndrome or its artery (sx), and extra accepted
  // answers (acc). The lesion side is the patient's left throughout.
  const LES_QUIZ = {
    "les:cc": { sx: "An older adult falls forward onto their face and hyperextends the neck. Both arms, especially the hands, are much weaker than the legs, and there is a cape-like loss of pain and temperature over the shoulders and arms with touch and vibration preserved. Sensation around the anus is spared.", acc: ["central cord"] },
    "les:ac": { sx: "During repair of an aortic aneurysm, a patient becomes unable to move either leg. Pain and temperature are lost on both sides below the mid-thoracic level, but vibration and joint position sense are normal.", acc: ["anterior cord", "anterior spinal artery", "ASA syndrome"] },
    "les:pc": { sx: "A patient with long-standing vitamin B12 deficiency walks with a wide-based, stamping gait that is worse in the dark. Vibration and joint position sense are lost in both legs and the Romberg test is positive, while strength, pain and temperature sensation are normal.", acc: ["posterior cord", "dorsal column", "dorsal cord", "posterior column"] },
    "les:bs": { sx: "After a stab wound to the back, the left leg is weak and spastic with an extensor plantar response and has lost vibration and position sense. The right leg has lost pain and temperature sensation from a level just below the wound.", acc: ["Brown-Sequard", "hemisection", "cord hemisection"] },
    "les:web": { sx: "Sudden weakness of the right lower face, arm and leg. The left eyelid droops and the left eye rests down and out, with a dilated pupil that does not react to light.", acc: ["Weber", "ventromedial midbrain", "ventral midbrain"] },
    "les:ben": { sx: "The left eyelid droops and the left eye rests down and out with a dilated pupil. The right arm has a coarse tremor at rest and on movement and is clumsy, and vibration and position sense are reduced on the right.", acc: ["Benedikt", "Benedict", "paramedian midbrain"] },
    "les:cla": { sx: "The left eyelid droops and the left eye cannot look up, down or inward. The right arm and leg are clumsy, with an intention tremor and past-pointing, but strength and sensation are normal.", acc: ["Claude", "dorsal midbrain tegmental"] },
    "les:vmp": { sx: "Sudden weakness of the right lower face, arm and leg with slurred speech. The weak limbs are clumsier than the weakness explains. Eye movements and sensation are normal.", acc: ["ventromedial pontine", "medial pontine", "paramedian pontine"] },
    "les:vp": { sx: "Sudden weakness of the right arm and leg. The whole left side of the face, including the forehead, is weak, and the left eye cannot look outward, causing horizontal double vision that is worse looking left.", acc: ["Millard-Gubler", "Millard Gubler", "ventral pontine"] },
    "les:fov": { sx: "Neither eye can look to the left, and both rest turned toward the right. The whole left side of the face, including the forehead, is weak, the right arm and leg are weak, and vibration sense is reduced on the right.", acc: ["Foville", "inferior medial pontine"] },
    "les:lp": { sx: "Sudden vertigo, vomiting, ringing and loss of hearing in the left ear. The whole left side of the face is weak, the left arm and leg are clumsy, and pain and temperature are lost on the left side of the face and the right side of the body. There is a left Horner syndrome; strength is otherwise normal.", acc: ["lateral pontine", "AICA", "anterior inferior cerebellar artery"] },
    "les:lis": { sx: "After a day of dizziness and double vision, a patient appears unresponsive: the face and all four limbs are paralysed and they cannot speak or swallow. They can, however, look up and down and blink on command, and are fully aware of their surroundings.", acc: ["locked-in", "locked in", "pseudocoma"] },
    "les:lm": { sx: "Sudden vertigo, vomiting and hiccups. On the left: a droopy eyelid with a small pupil, loss of pain and temperature on the face, a clumsy arm and leg, and hoarseness with difficulty swallowing; the uvula is pulled to the right. Pain and temperature are lost over the right side of the body. Strength is normal.", acc: ["Wallenberg", "lateral medullary", "PICA", "dorsolateral medullary"] },
    "les:mm": { sx: "Sudden weakness of the right arm and leg with the face spared, and loss of vibration and position sense on the right. On protrusion, the tongue deviates to the left, and it later wastes and fasciculates.", acc: ["medial medullary", "Dejerine", "anterior bulbar"] },
    "les:aca": { sx: "Sudden weakness and numbness of the right leg and foot, with the arm only mildly affected and the face spared. The patient has become apathetic and slow to respond, has a grasp reflex in the right hand and is incontinent of urine.", acc: ["ACA", "anterior cerebral", "anterior cerebral artery"] },
    "les:mcad": { sx: "Sudden weakness and numbness of the right face and arm, worse than the leg, with the eyes deviated to the left. Speech is effortful and sparse, comprehension is impaired, and there is a right-sided visual field defect.", acc: ["dominant MCA", "MCA dominant", "left MCA", "MCA left", "dominant middle cerebral artery", "left middle cerebral artery"] },
    "les:mcan": { sx: "Sudden weakness and numbness of the left face and arm, worse than the leg, with the eyes deviated to the right. Speech is fluent but flat, and the patient ignores people and objects on their left and insists that nothing is wrong.", acc: ["non-dominant MCA", "nondominant MCA", "MCA non-dominant", "right MCA", "MCA right", "non-dominant middle cerebral artery", "right middle cerebral artery"] },
    "les:pca": { sx: "Sudden loss of vision on the right side of both eyes with central vision spared; the patient is aware of it. They can write a sentence but cannot read it back. Strength is normal.", acc: ["PCA", "posterior cerebral", "posterior cerebral artery"] },
    "les:wsa": { sx: "After a cardiac arrest with prolonged low blood pressure, both shoulders and upper arms are weak, while the hands, face and legs are relatively spared.", acc: ["ACA/MCA watershed", "MCA ACA watershed", "ACA MCA watershed", "anterior watershed", "anterior border zone", "man in a barrel"] },
    "les:wsp": { sx: "After an episode of severe low blood pressure, a patient can only see one object at a time, misreaches for things under visual guidance and has a lower visual field defect, with little or no weakness.", acc: ["MCA/PCA watershed", "MCA PCA watershed", "PCA MCA watershed", "posterior watershed", "posterior border zone"] }
  };

  // Quiz-only function lines for brain structures (ST): what it does, without naming it
  const STF = {
    PFC: "Executive function: planning, working memory, attention, inhibiting inappropriate behaviour and guiding social conduct.",
    BRO: "Plans the motor programme for speech and handles grammar in the dominant hemisphere.",
    PM: "Plans and sequences movement, including self-initiated sequences and two-handed coordination.",
    M1: "Issues the main corticospinal and corticobulbar commands for voluntary movement, especially fine distal movement.",
    S1: "First cortical stage of discriminative touch and position sense from the opposite side of the body.",
    PAR: "Builds a map of the body and surrounding space from touch and vision, directing spatial attention and skilled action.",
    V1: "First cortical stage of vision, receiving the optic radiation.",
    A1: "First cortical stage of hearing, with a tonotopic map.",
    WER: "Links speech sounds to word meanings in the dominant hemisphere: language comprehension.",
    OLF: "Receives smell directly from the olfactory bulb, without a thalamic relay.",
    ANT: "Limbic relay from the mammillary bodies to the cingulate gyrus (Papez circuit), for episodic memory.",
    VA: "Relays basal ganglia output to premotor and prefrontal cortex to help initiate movement.",
    VL: "Relays cerebellar output to the motor and premotor cortex.",
    MD: "Thalamic partner of the prefrontal cortex: working memory, executive function, emotion and motivation.",
    IL: "Thalamic part of the arousal system, also projecting heavily to the striatum.",
    VPL: "Thalamic relay for touch, proprioception, pain and temperature from the opposite side of the body.",
    VPM: "Thalamic relay for sensation from the opposite side of the face, and for taste.",
    PUL: "Thalamic hub for visual attention, linked with parietal, temporal and occipital association cortex.",
    LGN: "Thalamic relay of the optic tract to the primary visual cortex.",
    MGN: "Thalamic relay of the auditory pathway to the primary auditory cortex.",
    CAU: "Striatal input station for prefrontal and association cortex: the cognitive and eye-movement basal ganglia loops.",
    PUT: "Striatal input station for sensorimotor cortex: the motor basal ganglia loop.",
    GPE: "Indirect-pathway relay that inhibits the subthalamic nucleus.",
    GPI: "Main output of the basal ganglia, tonically inhibiting the motor thalamus.",
    STN: "Excitatory (glutamatergic) brake on movement that drives the pallidal output nucleus.",
    SN: "Supplies dopamine to the striatum, facilitating the start of movement.",
    ANTL: "Regulates muscle tone and corrects ongoing limb movement, especially of the legs, using spinocerebellar input.",
    VERM: "Controls posture, trunk, gait and saccade accuracy, and adjusts ongoing limb movement.",
    HEM: "Plans and times skilled multi-joint movement using input relayed from the cerebral cortex.",
    FN: "Controls balance, the vestibulo-ocular reflex and gaze holding.",
    FAS: "Deep cerebellar nucleus driving the vestibulospinal and reticulospinal systems for posture and axial muscles.",
    GLO: "Small deep cerebellar nucleus that adjusts ongoing limb movement through the red nucleus.",
    EMB: "Deep cerebellar nucleus beside the dentate hilum that adjusts ongoing limb movement through the red nucleus.",
    DEN: "Largest deep cerebellar nucleus, sending the lateral hemisphere's output to the motor thalamus to plan skilled movement.",
    MCP: "Carries the crossed input from the pontine nuclei (cortex to cerebellum) into the cerebellum.",
    ICP: "Brings spinocerebellar, olivary and vestibular input into the cerebellum from the medulla.",
    SCP: "Carries the main cerebellar output to the red nucleus and thalamus."
  };

  // Items too similar in function to be offered against each other as answer options
  const CONFUSE = [
    ["lst", "ast", "sl", "VPL"], ["dc", "ml", "VPL", "S1"], ["tl", "cn5", "VPM"], ["ll", "cn8", "MGN", "A1"], ["cn2", "LGN", "V1"],
    ["dtc", "DEN", "SCP", "VL", "HEM", "EMB", "GLO"], ["pcb", "MCP", "HEM"], ["ICP", "dsc", "cun", "olcb", "vsc", "ANTL", "VERM"],
    ["ns", "SN", "PUT", "CAU"], ["GPI", "VA", "VL", "STN", "GPE"], ["lcst", "acst", "cb", "M1", "PM"], ["vst", "FAS", "FN", "prst", "mrst", "VERM"],
    ["rub", "crb", "GLO", "EMB", "ctt"], ["ctt", "olcb", "dtc"], ["mlf", "cn3", "cn4", "cn6", "FN"], ["BRO", "WER"], ["PFC", "MD"], ["cn9", "cn10"], ["cb", "cn7", "cn12", "cn5"]
  ];
  const confusable = (a, b) => CONFUSE.some(g => g.includes(a) && g.includes(b));

  // --- Help (?) Modal ---
  // keyboard users land on the close button when the help opens, and return to the ? button when it closes
  const openHelp = () => { helpModal?.classList.remove("hidden"); $("#help-close-btn")?.focus(); };
  const closeHelp = () => { helpModal?.classList.add("hidden"); $("#help-btn")?.focus(); };
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
        // Cranial nerves also accept "CN V", "CN 5" and the bare nerve name ("Trigeminal")
        const cnNames = [];
        const cn = t.n.match(/^CN ([IVX]+) (.+)$/);
        if (cn) cnNames.push(`CN ${cn[1]}`, `CN ${t.id.slice(2)}`, cn[2]);
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
            acceptNames: [t.id, subLabel, t.n, cleanTract, subLabel.replace(/\s*\([^)]*\)/g, ""), ...cnNames]
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

  // Lesions with quiz data, optionally limited to some slices
  const lesionItems = slices => LES.filter(L => LES_QUIZ[L.id] && (!slices || slices.has(L.lv)));

  // Tracts, nerves and structures with a function line; `lvs` are the slices each one appears on
  let funcAll = null;
  function funcItems(slices) {
    if (!funcAll) {
      funcAll = [
        ...T.filter(t => t.f).map(t => ({ id: t.id, kind: "tract", name: t.n, func: t.f, explanation: t.l || "", lvs: getSlicesForItem(t.id) })),
        ...Object.keys(STF).map(id => ({ id, kind: "st", name: ST[id][0], func: STF[id], explanation: ST[id][1], lvs: Object.keys(FB).filter(k => FB[k].some(e => e[0] === id)) }))
      ];
    }
    return slices ? funcAll.filter(f => f.lvs.some(k => slices.has(k))) : funcAll;
  }

  // How many questions the current format can draw from, overall or for one slice
  function poolSize(slices) {
    const m = quizConfig.mode;
    if (LESION_MODES.includes(m)) return lesionItems(slices).length;
    if (FUNC_MODES.includes(m)) return funcItems(slices).length;
    return [...slices].reduce((n, k) => n + getItemsForSlice(k).length, 0);
  }

  function updateQuizSetupUI() {
    if (!sliceChecksContainer) return;
    sliceChecksContainer.innerHTML = SEC.map(([k, n]) => {
      const shortTitle = n.split(":")[0];
      const checked = quizConfig.slices.has(k) ? "checked" : "";
      const count = poolSize(new Set([k]));
      return `<label class="qslice-check">
        <input type="checkbox" value="${k}" ${checked}>
        <span>${shortTitle} <small style="color:var(--mut)">(${count})</small></span>
      </label>`;
    }).join("");

    const m = quizConfig.mode, size = poolSize(quizConfig.slices);
    const n = quizConfig.slices.size, isLabel = m === "label";
    const countLabel = $("#quiz-count-label");
    if (countLabel) countLabel.textContent = isLabel ? "3. Number of Slices (up to 8 structures each)" : "3. Number of Questions";
    // the arrow option only applies to the identify-on-a-slice formats
    $("#quiz-anim-select")?.closest(".setup-section")?.classList.toggle("setup-off", !SLICE_MODES.includes(m));
    if (poolInfoEl) {
      const what = LESION_MODES.includes(m) ? "lesion syndromes" : FUNC_MODES.includes(m) ? "tracts, nerves and structures" : "testable structures";
      poolInfoEl.textContent = `${size} ${what} across ${n} selected slice${n === 1 ? "" : "s"}`
        + (isLabel && quizConfig.count > n ? ` · ${n} round${n === 1 ? "" : "s"}: each slice is used once` : "")
        + (!isLabel && size && quizConfig.count > size ? ` · only ${size} question${size === 1 ? "" : "s"} available` : "");
    }
    if (startQuizBtn) {
      startQuizBtn.disabled = size === 0;
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
      else if (p === "stem") ["rmb", "cmb", "rp", "cp", "rm", "mm", "cm", "c", "lum"].forEach(k => quizConfig.slices.add(k));
      else if (p === "fore") ["cx", "th", "cbl"].forEach(k => quizConfig.slices.add(k));
      updateQuizSetupUI();
    });
  });

  $("#quiz-format-select")?.addEventListener("click", e => {
    const card = e.target.closest("[data-qmode]");
    if (!card) return;
    quizConfig.mode = card.dataset.qmode;
    $("#quiz-format-select").querySelectorAll(".qmode-card").forEach(c => c.classList.toggle("active", c === card));
    updateQuizSetupUI();
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
    updateQuizSetupUI();
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

  // Fuzzy / Synonym grader for "Type the Name" mode. Only generic words are dropped; "lemniscus" stays because it
  // tells the medial, lateral, spinal and trigeminal lemnisci apart from other "medial"/"lateral" structures.
  function normalizeAns(s) {
    return (s || "")
      .normalize("NFD").replace(/[̀-ͯ]/g, "")   // Séquard = Sequard
      .toLowerCase()
      .replace(/\b(tract|nucleus|nuclei|fasciculus|fascicles|fibres|fibers|pathway|system|area|gyrus|cortex|nerve|syndrome|of|the|and)\b/g, " ")
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
      if (!normUser || !normCand) continue;
      if (normUser === normCand) return true;
      // A shortened answer counts only if it is most of the name ("trigeminal" for "CN V Trigeminal"),
      // so a single generic word ("lateral", "spinal") is not enough
      if (normUser.length >= 4 && normCand.includes(normUser) && normUser.length >= 0.75 * normCand.length) return true;
      // Typos: 1 letter in a short word, 2 in a longer one
      const allowed = Math.min(normUser.length, normCand.length) >= 8 ? 2 : 1;
      if (normUser.length >= 5 && normCand.length >= 5 && editDistance(normUser, normCand) <= allowed) return true;
    }
    return false;
  }

  // Lesion names: the name and each alternative name (with and without its bracketed part) plus the quiz extras,
  // minus any name two syndromes share (plain "MCA" fits both MCA strokes, so the hemisphere must be given)
  const normLes = s => normalizeAns((s || "").replace(/\b(stroke|infarction|infarct|territory|hemisphere|artery|occlusion|lesion)\b/gi, " "));
  let lesNames = null;
  function lesionNames(L) {
    if (!lesNames) {
      const all = new Map(), count = new Map();
      LES.forEach(l => {
        const raw = [l.n, ...(l.aka || "").split(" · "), ...((LES_QUIZ[l.id] || {}).acc || [])];
        const set = new Set();
        raw.forEach(r => [r.replace(/\([^)]*\)/g, " "), r.replace(/[()]/g, " ")].forEach(v => { const k = normLes(v); if (k) set.add(k); }));
        all.set(l.id, set);
        set.forEach(k => count.set(k, (count.get(k) || 0) + 1));
      });
      lesNames = new Map([...all].map(([id, set]) => [id, [...set].filter(k => count.get(k) === 1)]));
    }
    return lesNames.get(L.id) || [];
  }

  // Lesion answers must match a name (allowing a typo or two), not just share a word with it
  function checkLesionAnswer(raw, L) {
    const u = normLes(raw);
    if (!u) return false;
    return lesionNames(L).some(c => {
      if (u === c) return true;
      const allowed = Math.min(u.length, c.length) >= 8 ? 2 : 1;
      return u.length >= 5 && c.length >= 5 && editDistance(u, c) <= allowed;
    });
  }

  // Build an unlabelled SVG string for a slice (stripping <title> tooltips so hovering doesn't leak the answer).
  // Clip-path ids are renamed so they do not collide with the hidden atlas slices.
  function buildQuizSliceSVG(lv, keepTitles = false) {
    const w = FB[lv];
    const rawSvg = (w ? fore(lv) : sh(lv)).replace(/id="clip-/g, 'id="qclip-');
    const body = keepTitles ? rawSvg : rawSvg.replace(/<title>[\s\S]*?<\/title>/gi, "");
    return `<svg id="quiz-svg" viewBox="0 0 ${w ? 400 : 360} 200">${body}</svg>`;
  }

  // Shade a lesion on the quiz slice and mark the structures it hits (titles are read, then removed)
  function paintQuizLesion(svg, L, side) {
    const g = svg.querySelector(".lov");
    const saved = LSIDE;
    LSIDE = side;
    if (g) g.innerHTML = lesionOverlay(L).replace(/url\(#clip-/g, "url(#qclip-");
    LSIDE = saved;
    svg.querySelectorAll(".sh").forEach(e => {
      const h = hitOf(L, e.dataset.id, hitName(e));
      if (h && (!L.uni || e.dataset.side === side)) e.classList.add(h === "f" ? "hit" : "part");
      else e.classList.add("quiz-dim");
    });
    svg.querySelectorAll(".st").forEach(e => {
      const h = L.hit[e.dataset.id];
      e.classList.add(h ? (h === "f" ? "hit" : "part") : "quiz-dim");
    });
    svg.querySelectorAll("title").forEach(t => t.remove());
  }

  // --- Start Quiz ---
  startQuizBtn?.addEventListener("click", () => {
    closeQuizModal();
    launchQuizSession();
  });

  // --- Question builders ---
  // Every non-label question is one object: kind ("mcq" or "type"), an optional slice (lv) with a decorate(svg) step,
  // the prompt, an optional vignette, options + correct index or an accept(answer) check, the answer and explanation
  // shown afterwards, and a review entry for the results screen.
  const shortText = (s, n = 90) => s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s;
  const sliceName = lv => ((SEC.find(([k]) => k === lv) || [lv, lv])[1]);

  // Up to `n` distractors from `cands`, preferring those that share `prefer(c)`, skipping duplicates by `key`
  function pickDistractors(cands, n, key, prefer) {
    const seen = new Set();
    const sorted = shuffle(cands).sort((a, b) => (prefer(b) ? 1 : 0) - (prefer(a) ? 1 : 0));
    return sorted.filter(c => { const k = key(c); if (seen.has(k)) return false; seen.add(k); return true; }).slice(0, n);
  }

  function identifyQuestion(item, pool) {
    const names = new Set([item.displayName]);   // the same structure appears on several slices: one option per name
    const distractors = shuffle(pool).filter(other => {
      if (other.id === item.id || names.has(other.displayName)) return false;
      names.add(other.displayName);
      return true;
    }).slice(0, 3);
    const options = shuffle([item, ...distractors]);
    const arrows = quizConfig.anim === "show" && !item.isFB;
    return {
      kind: quizConfig.mode, lv: item.lv, sliceTitle: item.sliceTitle,
      animClass: quizConfig.anim === "hide" ? "hide-quiz-anim" : "",
      tract3D: item.isFB || quizConfig.anim === "hide" ? null : T.find(x => x.id === item.id),
      decorate: svg => highlightQuizItem(svg, item),
      prompt: `Identify the highlighted ${item.isFB ? "brain structure / nucleus" : "tract or cranial nerve structure"} on this slice:`,
      sub: arrows ? "Conduction direction arrows (▲/▼) are shown on the slice." : "Direction animations are hidden — identify by anatomical position.",
      options: options.map(o => o.displayName), correct: options.indexOf(item),
      accept: raw => checkTypedAnswer(raw, item),
      placeholder: "Type tract, nucleus, or abbreviation (e.g. LCST, ML, CN III, VPL)…",
      answer: item.displayName, explanation: item.explanation,
      review: { title: item.displayName, where: item.sliceTitle.split(":")[0], inspectId: item.id, inspectLv: item.lv }
    };
  }

  function lesionExplanation(L) {
    return `${L.aka ? `<strong>Also called:</strong> ${L.aka}.<br>` : ""}${L.vessel ? `<strong>Blood supply:</strong> ${L.vessel}<br>` : ""}<strong>Affected:</strong> ${L.area}`;
  }

  function lesionQuestion(L, mode) {
    const review = { title: L.n, where: L.slice || "cervical spinal cord", inspectId: L.id, inspectLv: L.lv };
    const base = { answer: L.n, explanation: lesionExplanation(L), review };
    const typeHint = "Eponyms, descriptive and arterial names are all accepted; for an MCA stroke, say dominant or non-dominant.";
    if (mode === "lsx") {
      return { ...base, kind: "type", prompt: "Which lesion syndrome best explains this presentation?", sub: typeHint,
        vignette: LES_QUIZ[L.id].sx, accept: raw => checkLesionAnswer(raw, L), placeholder: "Type the syndrome (e.g. Wallenberg, lateral medullary)…" };
    }
    if (mode === "lsh") {
      const side = Math.random() < 0.5 ? "L" : "R";
      return { ...base, kind: "type", lv: L.lv, sliceTitle: sliceName(L.lv), keepTitles: true,
        decorate: svg => paintQuizLesion(svg, L, side),
        prompt: "Name the lesion syndrome shaded on this slice.",
        sub: `The shaded area is the lesion; <span class="lg-hit">red</span> structures are damaged and <span class="lg-part">amber</span> ones may be partly affected. ${typeHint}`,
        accept: raw => checkLesionAnswer(raw, L), placeholder: "Type the syndrome…" };
    }
    // sxl: pick the matching presentation, with distractors from the same group (spinal, brainstem or cerebral) first
    const others = pickDistractors(lesionItems().filter(o => o.id !== L.id), 3, o => o.id, o => o.grp === L.grp);
    const opts = shuffle([L, ...others]);
    return { ...base, kind: "mcq", long: true, prompt: `Which presentation fits <strong>${L.n}</strong>?`,
      sub: "The lesion is on the patient's left in every option.",
      options: opts.map(o => LES_QUIZ[o.id].sx), correct: opts.indexOf(L), answer: LES_QUIZ[L.id].sx };
  }

  function functionQuestion(f, mode) {
    const lv = f.lvs[0];
    const review = { title: f.name, where: f.kind === "st" ? (REGION[f.id] || "Structure") : (LN[T.find(x => x.id === f.id)?.d] || "Pathway"), inspectId: f.id, inspectLv: lv };
    const explanation = f.explanation;
    const others = pickDistractors(funcItems().filter(o => o.id !== f.id && !confusable(o.id, f.id) && o.func !== f.func),
      3, o => mode === "sfn" ? o.name : o.func, o => o.kind === f.kind);
    const opts = shuffle([f, ...others]);
    if (mode === "sfn") {
      return { kind: "mcq", prompt: "Which tract, nerve or structure has this function?", vignette: f.func,
        options: opts.map(o => o.name), correct: opts.indexOf(f), answer: f.name, explanation, review };
    }
    return { kind: "mcq", long: true, prompt: `What does the <strong>${f.name}</strong> do?`,
      options: opts.map(o => o.func), correct: opts.indexOf(f), answer: f.func, explanation, review };
  }

  function buildQuestions() {
    const m = quizConfig.mode, n = quizConfig.count;
    if (LESION_MODES.includes(m)) return shuffle(lesionItems(quizConfig.slices)).slice(0, n).map(L => lesionQuestion(L, m));
    if (FUNC_MODES.includes(m)) return shuffle(funcItems(quizConfig.slices)).slice(0, n).map(f => functionQuestion(f, m));
    const pool = buildFullPool();
    return shuffle(pool).slice(0, n).map(item => identifyQuestion(item, pool));
  }

  function launchQuizSession() {
    if (!poolSize(quizConfig.slices)) return;

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
      const questions = buildQuestions();
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

  // Point the 3D brain at the question's slice (and the tract, when showing it gives nothing away)
  function sync3DForQuizItem(lv, tract) {
    if (brain3d) {
      brain3d.setTractPathway(tract || null);
      if (lv) {
        brain3d.setActiveSlice(lv);
        brain3d.highlightTractSlices(new Set([lv]));
      }
    }
    document.querySelectorAll(".blk").forEach(b => b.classList.toggle("active-lv", !!lv && b.dataset.s === lv));
  }

  // Highlight only the target shape(s) of an identify question inside #quiz-svg
  function highlightQuizItem(svg, item) {
    if (item.isFB) {
      svg.querySelectorAll(".st").forEach(el => {
        const isMatch = el.dataset.id === item.id;
        el.classList.toggle("quiz-target", isMatch);
        el.classList.toggle("quiz-dim", !isMatch);
      });
      return;
    }
    // Match specific sub-structure indices for this tract on this slice; each index draws a Left and a Right shape
    const shapesByTract = [...svg.querySelectorAll(`.sh[data-id="${item.id}"]`)];
    const arrowsByTract = [...svg.querySelectorAll(`.ar[data-id="${item.id}"]`)];
    const targetElemSet = new Set(), targetArrowSet = new Set();
    item.indices.forEach(subIdx => {
      [subIdx * 2, subIdx * 2 + 1].forEach(i => {
        if (shapesByTract[i]) targetElemSet.add(shapesByTract[i]);
        if (arrowsByTract[i]) targetArrowSet.add(arrowsByTract[i]);
      });
    });
    svg.querySelectorAll(".sh").forEach(el => {
      const isMatch = targetElemSet.has(el);
      el.classList.toggle("quiz-target", isMatch);
      el.classList.toggle("quiz-dim", !isMatch);
    });
    if (quizConfig.anim === "show") targetArrowSet.forEach(arEl => arEl.classList.add("on"));
  }

  // --- Render one question (any format except Label the Slice) ---
  function renderQuestionRound() {
    if (!quizState || quizState.idx >= quizState.questions.length) {
      renderQuizSummary();
      return;
    }
    const q = quizState.questions[quizState.idx];
    quizState.answered = false;

    sync3DForQuizItem(q.lv, q.tract3D);

    const modeTitle = MODE_TITLES[quizState.mode] || "Quiz";
    const sliceBox = q.lv ? `
        <div class="quiz-slice-box ${q.animClass || ""}" id="quiz-slice-box">
          <div class="quiz-slice-title">${q.sliceTitle}</div>
          ${buildQuizSliceSVG(q.lv, q.keepTitles)}
        </div>` : "";

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

      <div class="quiz-main-grid${q.lv ? "" : " no-slice"}">
        ${sliceBox}

        <div class="quiz-qa-box">
          <p class="quiz-prompt">${q.prompt}</p>
          ${q.sub ? `<p class="quiz-subprompt">${q.sub}</p>` : ""}
          ${q.vignette ? `<div class="quiz-vignette">${q.vignette}</div>` : ""}

          ${q.kind === "mcq" ? `
            <div class="mcq-list" id="quiz-mcq-list">
              ${q.options.map((opt, i) => `
                <button type="button" class="mcq-btn${q.long ? " long" : ""}" data-opt-idx="${i}">
                  <span class="mcq-key">${i + 1}</span>
                  <span>${opt}</span>
                </button>
              `).join("")}
            </div>
          ` : `
            <form class="type-form" id="quiz-type-form">
              <input type="text" class="type-input" id="quiz-type-input" placeholder="${q.placeholder}" autocomplete="off">
              <button type="submit" class="primary-btn" id="quiz-type-submit">Submit</button>
            </form>
          `}

          <div id="quiz-feedback-slot"></div>
        </div>
      </div>
    `;

    updateSliceImageMode();
    const svg = $("#quiz-svg");
    if (svg && q.decorate) q.decorate(svg);

    $("#quiz-reconfig-btn")?.addEventListener("click", openQuizModal);
    $("#quiz-exit-btn")?.addEventListener("click", exitQuizMode);

    if (q.kind === "mcq") {
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

  // Multiple Choice: number keys 1-4 pick the matching option (not while typing in a field or with a dialog open)
  document.addEventListener("keydown", e => {
    if (!quizState || quizState.answered || !quizState.questions) return;
    if (e.ctrlKey || e.metaKey || e.altKey || /INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName)) return;
    if (document.querySelector(".modal-backdrop:not(.hidden)")) return;
    const q = quizState.questions[quizState.idx];
    const n = parseInt(e.key, 10);
    if (!q || q.kind !== "mcq" || !(n >= 1 && n <= q.options.length)) return;
    e.preventDefault();
    submitMcqAnswer(n - 1);
  });

  function showQuestionFeedback(isCorrect, userAnswerText, q) {
    quizState.answered = true;
    if (isCorrect) quizState.score++;
    quizState.history.push({ ...q.review, isCorrect, userAnswerText: shortText(userAnswerText) });

    const slot = $("#quiz-feedback-slot");
    if (!slot) return;
    const isLast = quizState.idx + 1 >= quizState.questions.length;
    // long answers (presentations, functions) are already marked in the option list, so are not repeated
    const correctText = q.long ? "the highlighted option" : q.answer;
    slot.innerHTML = `
      <div class="quiz-feedback ${isCorrect ? "ok" : "err"}">
        <strong>${isCorrect ? "✓ Correct!" : `✕ Incorrect — Correct answer: ${correctText}`}</strong>
        ${q.long ? `<div><strong>${q.review.title}</strong></div>` : ""}
        <div>${q.explanation || ""}</div>
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
    const isCorrect = optIdx === q.correct;

    $("#quiz-mcq-list")?.querySelectorAll(".mcq-btn").forEach((btn, i) => {
      btn.disabled = true;
      if (i === q.correct) btn.classList.add("correct");
      else if (i === optIdx && !isCorrect) btn.classList.add("wrong");
    });

    showQuestionFeedback(isCorrect, q.options[optIdx], q);
  }

  function submitTypeAnswer(val) {
    const q = quizState.questions[quizState.idx];
    const isCorrect = q.accept(val);
    const inputEl = $("#quiz-type-input");
    const submitBtn = $("#quiz-type-submit");
    if (inputEl) inputEl.disabled = true;
    if (submitBtn) submitBtn.disabled = true;
    showQuestionFeedback(isCorrect, val.trim() || "(Blank)", q);
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
          // structures drawn in both hemispheres (e.g. the dentate nucleus) get a clickable, numbered copy on each side
          svg.querySelectorAll(`.st[data-id="${it.id}"]`).forEach(el => {
            el.classList.add("quiz-label-node");
            el.dataset.nodeUid = it.uid;
            const cx = el.getAttribute("cx"), cy = el.getAttribute("cy");
            svg.insertAdjacentHTML("beforeend", `<text class="quiz-node-pin" data-pin-uid="${it.uid}" x="${cx}" y="${parseFloat(cy) + 2.5}">${pinNum}</text>`);
          });
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
        title: item.displayName, where: item.sliceTitle.split(":")[0], inspectId: item.id, inspectLv: item.lv,
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

      svg?.querySelectorAll(`[data-pin-uid="${nodeUid}"]`).forEach(pin => { pin.textContent = "✓"; });

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
                <strong>${h.isCorrect ? "✓" : "✕"} ${h.title}</strong>
                <div style="font-size:11px;color:var(--mut)">${h.where} · Your answer: ${h.userAnswerText}</div>
              </div>
              <button type="button" class="mini-btn" data-inspect-id="${h.inspectId}" data-inspect-lv="${h.inspectLv || ""}">Inspect</button>
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
    lastBrainSel = undefined;
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

new ResizeObserver(layout).observe($("#dsv"));   // the drawing itself: it also resizes when the route card grows
renderSidebar();
fitSliceViewBoxes();
if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitSliceViewBoxes);
layout();
paint();

// Keep sticky panels clear of the pinned top bar: publish its real height as --topbar-h
(function trackTopbar() {
  const bar = $("#topbar");
  const update = () => document.documentElement.style.setProperty("--topbar-h", Math.round(bar.getBoundingClientRect().height) + "px");
  new ResizeObserver(update).observe(bar);
  window.addEventListener("resize", update);
  update();
})();
