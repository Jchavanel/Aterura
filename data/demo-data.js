/* ═══════════════════════════════════════════════════════════
   ESCUDERÍA ATERURA — data/demo-data.js
   ─────────────────────────────────────────────────────────
   Datos de ejemplo que se muestran cuando un campeonato
   no tiene Google Sheet configurado (sheet_id vacío).
   Actualiza estos datos manualmente o conéctalos a Sheets.

   FORMATO DE CADA DATASET:
   {
     rounds: ['R1-Nombre','R2-Nombre',...],   ← cabeceras de pruebas
     rows:   [
       { pos, piloto, copiloto, equipo, vehiculo, pts:[R1,R2,...], total },
       ...
     ]
   }
═══════════════════════════════════════════════════════════ */

const DEMO_DATA = {

  /* ════════════════════ WRC ════════════════════ */
  'wrc::asfalto::pilotos': {
    rounds: ['Montecarlo','Suecia','Kenya','Chile','Rally1','Finlandia','Alemania','Gran Bretaña'],
    rows: [
      { pos:1, piloto:'T. Neuville',  copiloto:'M. Wydaeghe', equipo:'Hyundai WRT',      vehiculo:'Hyundai i20N Rally1', pts:[25,0,25,18,25,18,15,25], total:151 },
      { pos:2, piloto:'S. Ogier',     copiloto:'V. Landais',  equipo:'Toyota GAZOO',      vehiculo:'GR Yaris Rally1',     pts:[18,25,15,25,0,25,25,15], total:148 },
      { pos:3, piloto:'E. Evans',     copiloto:'S. Martin',   equipo:'Toyota GAZOO',      vehiculo:'GR Yaris Rally1',     pts:[15,18,18,15,18,15,18,18], total:135 },
      { pos:4, piloto:'S. Loeb',      copiloto:'N. Gilsoul',  equipo:'Hyundai WRT',       vehiculo:'Hyundai i20N Rally1', pts:[12,15,12,12,15,12,12,12], total:102 },
      { pos:5, piloto:'A. Fourmaux',  copiloto:'A. Coria',    equipo:'M-Sport Ford',      vehiculo:'Puma Rally1',         pts:[10,12,10,10,12,10,10,10], total:84  },
      { pos:6, piloto:'K. Rovanperä',  copiloto:'J. Halttunen',equipo:'Toyota GAZOO',    vehiculo:'GR Yaris Rally1',     pts:[0,10,0,0,10,0,6,8],       total:34  },
    ]
  },

  'wrc::asfalto::copilotos': {
    rounds: ['Montecarlo','Suecia','Kenya','Chile','Rally1','Finlandia','Alemania','Gran Bretaña'],
    rows: [
      { pos:1, piloto:'M. Wydaeghe',  copiloto:'T. Neuville', equipo:'Hyundai WRT', vehiculo:'Hyundai i20N Rally1', pts:[25,0,25,18,25,18,15,25], total:151 },
      { pos:2, piloto:'V. Landais',   copiloto:'S. Ogier',    equipo:'Toyota GAZOO', vehiculo:'GR Yaris Rally1',    pts:[18,25,15,25,0,25,25,15], total:148 },
      { pos:3, piloto:'S. Martin',    copiloto:'E. Evans',    equipo:'Toyota GAZOO', vehiculo:'GR Yaris Rally1',    pts:[15,18,18,15,18,15,18,18], total:135 },
    ]
  },

  'wrc::asfalto::equipos': {
    rounds: ['Montecarlo','Suecia','Kenya','Chile','Rally1','Finlandia','Alemania','Gran Bretaña'],
    rows: [
      { pos:1, piloto:'Toyota GAZOO Racing WRT', copiloto:'—', equipo:'Toyota', vehiculo:'GR Yaris Rally1', pts:[48,68,48,65,43,55,68,56], total:451 },
      { pos:2, piloto:'Hyundai Shell Mobis WRT', copiloto:'—', equipo:'Hyundai', vehiculo:'i20N Rally1',   pts:[55,25,55,48,55,48,42,55], total:383 },
      { pos:3, piloto:'M-Sport Ford WRT',        copiloto:'—', equipo:'Ford', vehiculo:'Puma Rally1',      pts:[22,30,22,25,27,22,22,22], total:192 },
    ]
  },

  /* ════════════════════ CERA ════════════════════ */
  'cera::asfalto::pilotos': {
    rounds: ['La Llana','Lorca','Llanes','RallyRACC','Islas Canarias','Ciudad de Pozoblanco'],
    rows: [
      { pos:1, piloto:'D. Sordo',    copiloto:'C. Carrera',  equipo:'Hyundai WRT',    vehiculo:'Hyundai i20N Rally1', pts:[25,25,18,25,25,18], total:136 },
      { pos:2, piloto:'J. Lamela',   copiloto:'U. Conde',    equipo:'Rallye Team Sp', vehiculo:'GR Yaris Rally2',    pts:[18,18,25,18,18,25], total:122 },
      { pos:3, piloto:'E. Cruz',     copiloto:'Y. Mujica',   equipo:'Aterura',        vehiculo:'Ford Fiesta Rally2',  pts:[15,15,15,15,15,15], total:90  },
      { pos:4, piloto:'L. Monzón',   copiloto:'J.C. Déniz',  equipo:'—',              vehiculo:'Skoda Fabia Rally2',  pts:[12,12,12,12,12,12], total:72  },
      { pos:5, piloto:'J. Falcón',   copiloto:'J. Páez',     equipo:'—',              vehiculo:'Porsche GT3',         pts:[10,10,10,10,10,10], total:60  },
      { pos:6, piloto:'A. Suárez',   copiloto:'C. del Barrio',equipo:'—',             vehiculo:'Citroën C3 Rally2',   pts:[8,8,8,8,8,8],       total:48  },
    ]
  },

  'cera::asfalto::copilotos': {
    rounds: ['La Llana','Lorca','Llanes','RallyRACC','Islas Canarias','Pozoblanco'],
    rows: [
      { pos:1, piloto:'C. Carrera', copiloto:'D. Sordo',   equipo:'Hyundai WRT', vehiculo:'Hyundai i20N Rally1', pts:[25,25,18,25,25,18], total:136 },
      { pos:2, piloto:'U. Conde',   copiloto:'J. Lamela',  equipo:'Rallye Team Sp', vehiculo:'GR Yaris Rally2', pts:[18,18,25,18,18,25], total:122 },
      { pos:3, piloto:'Y. Mujica',  copiloto:'E. Cruz',    equipo:'Aterura', vehiculo:'Ford Fiesta Rally2', pts:[15,15,15,15,15,15], total:90 },
    ]
  },

  'cera::asfalto::equipos': {
    rounds: ['La Llana','Lorca','Llanes','RallyRACC','Islas Canarias','Pozoblanco'],
    rows: [
      { pos:1, piloto:'Hyundai WRT Spain',    copiloto:'—', equipo:'Hyundai', vehiculo:'i20N Rally1',  pts:[50,50,45,50,50,45], total:290 },
      { pos:2, piloto:'Rallye Team Spain',    copiloto:'—', equipo:'Toyota',  vehiculo:'GR Yaris R2',  pts:[35,35,40,35,35,40], total:220 },
      { pos:3, piloto:'Auto-Deportivo Norte', copiloto:'—', equipo:'Ford',    vehiculo:'Fiesta R2',    pts:[25,25,25,25,25,25], total:150 },
    ]
  },

  'cera::montana::pilotos': {
    rounds: ['Subida Escúzar','Subida Alhaurín','Copa Montaña','Guadix','La Guardia','Final'],
    rows: [
      { pos:1, piloto:'J.M. López',   copiloto:'—', equipo:'Racing Sport',  vehiculo:'Norma M20F',      pts:[25,25,25,25,18,18], total:136 },
      { pos:2, piloto:'A. Ortega',    copiloto:'—', equipo:'Speed Club',    vehiculo:'BRC CM05',        pts:[18,18,18,18,25,25], total:122 },
      { pos:3, piloto:'R. Castaño',   copiloto:'—', equipo:'Motorsport Sur',vehiculo:'Osella PA2000',   pts:[15,15,15,15,15,15], total:90  },
    ]
  },

  'cera::montana::copilotos': {
    rounds: ['Escúzar','Alhaurín','Copa Montaña','Guadix','La Guardia','Final'],
    rows: [
      { pos:1, piloto:'A. Ortega', copiloto:'—', equipo:'Speed Club', vehiculo:'BRC CM05', pts:[18,18,18,18,25,25], total:122 },
    ]
  },

  /* ════════════════════ CANARIAS ════════════════════ */
  'canarias::asfalto::pilotos': {
    rounds: ['RVdT','GC Historic','Sub.Tejeda','Sub.Arucas','Fuerteventura','Final'],
    rows: [
      { pos:1, piloto:'E. Cruz',      copiloto:'Y. Mujica',    equipo:'Escudería Aterura', vehiculo:'Ford Fiesta Rally2', pts:[25,25,25,25,25,25], total:150 },
      { pos:2, piloto:'L. Monzón',    copiloto:'J.C. Déniz',   equipo:'—',                 vehiculo:'Skoda Fabia R2',     pts:[18,18,18,18,18,18], total:108 },
      { pos:3, piloto:'J. Falcón',    copiloto:'J. Páez',       equipo:'—',                 vehiculo:'Porsche GT3',        pts:[15,15,15,15,15,15], total:90  },
      { pos:4, piloto:'A. Benítez',   copiloto:'P. González',   equipo:'—',                 vehiculo:'Mitsubishi Evo VII', pts:[12,12,12,12,12,12], total:72  },
      { pos:5, piloto:'R. Curbelo',   copiloto:'M. Expósito',   equipo:'Lanzarote Rally',   vehiculo:'Citroën DS3',        pts:[10,10,10,10,10,10], total:60  },
      { pos:6, piloto:'T. Cabrera',   copiloto:'F. Castellano', equipo:'Racing Canarias',   vehiculo:'Peugeot 208 R2',     pts:[8,8,8,8,8,8],       total:48  },
    ]
  },

  'canarias::asfalto::copilotos': {
    rounds: ['RVdT','GC Historic','Sub.Tejeda','Sub.Arucas','Fuerteventura','Final'],
    rows: [
      { pos:1, piloto:'Y. Mujica',   copiloto:'E. Cruz',    equipo:'Escudería Aterura', vehiculo:'Ford Fiesta R2', pts:[25,25,25,25,25,25], total:150 },
      { pos:2, piloto:'J.C. Déniz',  copiloto:'L. Monzón',  equipo:'—', vehiculo:'Skoda Fabia R2', pts:[18,18,18,18,18,18], total:108 },
      { pos:3, piloto:'J. Páez',     copiloto:'J. Falcón',  equipo:'—', vehiculo:'Porsche GT3',   pts:[15,15,15,15,15,15], total:90  },
    ]
  },

  'canarias::asfalto::equipos': {
    rounds: ['RVdT','GC Historic','Sub.Tejeda','Sub.Arucas','Fuerteventura','Final'],
    rows: [
      { pos:1, piloto:'Escudería Aterura',  copiloto:'—', equipo:'Aterura', vehiculo:'—', pts:[50,50,50,50,50,50], total:300 },
      { pos:2, piloto:'Racing Canarias',    copiloto:'—', equipo:'Various', vehiculo:'—', pts:[35,35,35,35,35,35], total:210 },
      { pos:3, piloto:'Lanzarote Rally',    copiloto:'—', equipo:'Various', vehiculo:'—', pts:[25,25,25,25,25,25], total:150 },
    ]
  },

  'canarias::montana::pilotos': {
    rounds: ['Sub.Tejeda','Sub.Arucas','Sub.Gáldar','Sub.Moya','Inagua','Final'],
    rows: [
      { pos:1, piloto:'M. Santana',   copiloto:'—', equipo:'GC Motor Sport', vehiculo:'BRC CM05',        pts:[25,25,25,18,25,25], total:143 },
      { pos:2, piloto:'P. Bethencourt',copiloto:'—',equipo:'Tenerife Racing', vehiculo:'Norma M20F',      pts:[18,18,18,25,18,18], total:115 },
      { pos:3, piloto:'A. Reyes',     copiloto:'—', equipo:'—',              vehiculo:'Radical SR4',     pts:[15,15,15,15,15,15], total:90  },
      { pos:4, piloto:'J. Hernández', copiloto:'—', equipo:'Lanzarote RC',   vehiculo:'Peugeot 306',     pts:[12,12,12,12,12,12], total:72  },
    ]
  },

  'canarias::montana::copilotos': {
    rounds: ['Sub.Tejeda','Sub.Arucas','Sub.Gáldar','Sub.Moya','Inagua','Final'],
    rows: [
      { pos:1, piloto:'P. Bethencourt', copiloto:'—', equipo:'Tenerife Racing', vehiculo:'Norma M20F', pts:[18,18,18,25,18,18], total:115 },
    ]
  },

  'canarias::regularidad::pilotos': {
    rounds: ['Prueba 1','Prueba 2','Prueba 3','Prueba 4','Prueba 5','Final'],
    rows: [
      { pos:1, piloto:'A. Vega',      copiloto:'C. Llorente',  equipo:'Classic Cars GC', vehiculo:'Porsche 911 SC',  pts:[25,25,25,25,25,18], total:143 },
      { pos:2, piloto:'R. Suárez',    copiloto:'M. Torres',    equipo:'Retro Motorsport', vehiculo:'Ford Escort RS',  pts:[18,18,18,18,18,25], total:115 },
      { pos:3, piloto:'F. Martín',    copiloto:'L. Peña',      equipo:'Clásicos Norte',  vehiculo:'Renault 5 Turbo', pts:[15,15,15,15,15,15], total:90  },
      { pos:4, piloto:'J. Jiménez',   copiloto:'P. García',    equipo:'—',               vehiculo:'BMW 2002',        pts:[12,12,12,12,12,12], total:72  },
    ]
  },

  'canarias::regularidad::navegantes': {
    rounds: ['Prueba 1','Prueba 2','Prueba 3','Prueba 4','Prueba 5','Final'],
    rows: [
      { pos:1, piloto:'C. Llorente', copiloto:'A. Vega',    equipo:'Classic Cars GC',  vehiculo:'Porsche 911 SC', pts:[25,25,25,25,25,18], total:143 },
      { pos:2, piloto:'M. Torres',   copiloto:'R. Suárez',  equipo:'Retro Motorsport', vehiculo:'Ford Escort RS', pts:[18,18,18,18,18,25], total:115 },
    ]
  }

}; /* end DEMO_DATA */
