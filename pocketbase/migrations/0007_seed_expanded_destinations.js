migrate(
  (app) => {
    const additionalDests = [
      {
        country: 'Alemanha',
        city: 'Berlim',
        countryCode: 'DE',
        policeNumber: '110',
        medicalEmergencyNumber: '112',
        generalEmergencyNumber: '112',
        consulateEmbassyName: 'Embaixada e Consulado-Geral do Brasil em Berlim',
        consulateAddress: 'Wallstraße 57, 10179 Berlin',
        consulatePhone: '+49 30 726 280',
        consulateEmail: 'consular.berlim@itamaraty.gov.br',
        consulateEmergency24h: '+49 170 870 9468 (Plantão Consular 24h Berlim)',
        safeHavens: [
          {
            name: 'Aeroporto de Berlim-Brandemburgo (BER)',
            type: 'Aeroporto Internacional 24h',
            address: 'Willy-Brandt-Platz, 12529 Schönefeld',
            notes: 'Posto da Bundespolizei (Polícia Federal Alemã) 24h no Terminal 1.',
          },
          {
            name: 'Charité - Universitätsmedizin Berlin (Campus Mitte)',
            type: 'Hospital Universitário / Pronto Socorro Central 24h',
            address: 'Charitéplatz 1, 10117 Berlin',
            notes: 'Centro de trauma e urgência com atendimento multilíngue 24h.',
          },
          {
            name: 'Berlin Hauptbahnhof (Estação Central)',
            type: 'Estação Central Ferroviária',
            address: 'Europaplatz 1, 10557 Berlin',
            notes:
              'Posto policial permanente da Bundespolizei e serviço Bahnhofsmission 24h para assistência imediata.',
          },
        ],
        travelTips: [
          'Linha de apoio a mulheres na Alemanha (Hilfetelefon Gewalt gegen Frauen): 116 016 (gratuito, 24h e em português).',
          'Ligue 112 para emergência médica e 110 para a polícia em todo o país sem custo.',
        ],
      },
      {
        country: 'Chile',
        city: 'Santiago',
        countryCode: 'CL',
        policeNumber: '133 (Carabineros de Chile)',
        medicalEmergencyNumber: '131 (SAMU)',
        generalEmergencyNumber: '133 / 131',
        consulateEmbassyName: 'Consulado-Geral do Brasil em Santiago',
        consulateAddress: 'Calle Los Militares 6191, Piso 1, Las Condes, Santiago',
        consulatePhone: '+56 2 2820 5800',
        consulateEmail: 'cg.santiago@itamaraty.gov.br',
        consulateEmergency24h: '+56 9 9334 5103 (Plantão Consular 24h Santiago)',
        safeHavens: [
          {
            name: 'Aeroporto Internacional Arturo Merino Benítez (SCL)',
            type: 'Aeroporto Internacional 24h',
            address: 'Pudahuel, Región Metropolitana',
            notes: 'Postos permanentes de Carabineros e PDI (Policía de Investigaciones) 24h.',
          },
          {
            name: 'Hospital de Urgencia Asistencia Pública (ex-Posta Central)',
            type: 'Hospital Público de Urgência 24h',
            address: 'Curicó 345, Santiago Centro',
            notes: 'Principal pronto-socorro de trauma e emergência do centro de Santiago.',
          },
        ],
        travelTips: [
          'Linha de apoio a mulheres no Chile (SernamEG): 1455 (gratuito e 24h).',
          'PDI (Policía de Investigaciones) atende no número 134.',
        ],
      },
      {
        country: 'Irlanda',
        city: 'Dublin',
        countryCode: 'IE',
        policeNumber: '999 / 112 (An Garda Síochána)',
        medicalEmergencyNumber: '999 / 112',
        generalEmergencyNumber: '112 ou 999',
        consulateEmbassyName: 'Embaixada e Setor Consular do Brasil em Dublin',
        consulateAddress: 'Block 8, Harcourt Centre, Charlotte Way, Dublin 2, D02 K580',
        consulatePhone: '+353 1 475 6000',
        consulateEmail: 'consular.dublin@itamaraty.gov.br',
        consulateEmergency24h: '+353 87 981 4403 (Plantão Consular 24h Dublin)',
        safeHavens: [
          {
            name: 'Dublin Airport (DUB)',
            type: 'Aeroporto Internacional 24h',
            address: 'Swords, Co. Dublin',
            notes: 'Airport Police Service e estação Garda 24h nos terminais 1 e 2.',
          },
          {
            name: "St. James's Hospital (Emergency Dept)",
            type: 'Hospital Público Universitário 24h',
            address: "James's Street, Dublin 8",
            notes: 'Maior pronto-socorro público de Dublin com atendimento emergencial completo.',
          },
          {
            name: 'Pearse Street Garda Station',
            type: 'Delegacia Central de Polícia 24h',
            address: 'Pearse St, Dublin 2',
            notes: 'Principal estação policial do centro de Dublin com atendimento 24 horas.',
          },
        ],
        travelTips: [
          'Linha Nacional de Apoio a Mulheres na Irlanda (Women’s Aid): 1800 341 900 (gratuito 24h).',
          'Número de emergência europeu 112 funciona gratuitamente de qualquer celular.',
        ],
      },
      {
        country: 'Canadá',
        city: 'Toronto / Ottawa',
        countryCode: 'CA',
        policeNumber: '911',
        medicalEmergencyNumber: '911',
        generalEmergencyNumber: '911',
        consulateEmbassyName: 'Consulado-Geral do Brasil em Toronto',
        consulateAddress: '77 Bloor St W, Suite 1109, Toronto, ON M5S 1M2',
        consulatePhone: '+1 416 922 2503',
        consulateEmail: 'cg.toronto@itamaraty.gov.br',
        consulateEmergency24h: '+1 437 239 8458 (Plantão Consular 24h Toronto)',
        safeHavens: [
          {
            name: 'Toronto Pearson International Airport (YYZ)',
            type: 'Aeroporto Internacional 24h',
            address: '6301 Silver Dart Dr, Mississauga, ON L5P 1B2',
            notes: 'Peel Regional Police e postos de apoio da CBSA 24h em todos os terminais.',
          },
          {
            name: "St. Michael's Hospital (Unity Health Toronto)",
            type: 'Hospital Central de Trauma e Emergência 24h',
            address: '36 Queen St E, Toronto, ON M5B 1W8',
            notes: 'Centro de trauma nível 1 no centro de Toronto com suporte a múltiplos idiomas.',
          },
        ],
        travelTips: [
          'Linha de Crise no Canadá (Assaulted Women’s Helpline): 1-866-863-0511 ou disque #SAFE no celular.',
          'Disque 911 de qualquer aparelho celular ativo para atendimento imediato.',
        ],
      },
      {
        country: 'México',
        city: 'Cidade do México',
        countryCode: 'MX',
        policeNumber: '911',
        medicalEmergencyNumber: '911 / 065 (Cruz Roja)',
        generalEmergencyNumber: '911',
        consulateEmbassyName: 'Embaixada e Consulado do Brasil na Cidade do México',
        consulateAddress: 'Calle Fernando Alencastre 136, Lomas de Virreyes, CDMX 11000',
        consulatePhone: '+52 55 5201 4531',
        consulateEmail: 'consular.mexico@itamaraty.gov.br',
        consulateEmergency24h: '+52 1 55 4553 4980 (Plantão Consular 24h México)',
        safeHavens: [
          {
            name: 'Aeroporto Internacional Benito Juárez (AICM)',
            type: 'Aeroporto Internacional 24h',
            address: 'Av. Capitán Carlos León S/N, Venustiano Carranza, CDMX',
            notes: 'Postos da Guardia Nacional e Polícia Federal mexicana 24h nos terminais 1 e 2.',
          },
          {
            name: 'Hospital General de México Dr. Eduardo Liceaga',
            type: 'Hospital Público de Referência 24h',
            address: 'Calle Dr. Balmis 148, Doctores, Cuauhtémoc, CDMX',
            notes: 'Grande centro hospitalar público com pronto-atendimento 24h.',
          },
        ],
        travelTips: [
          'Linha Mulher no México (Línea Mujeres CDMX): *765 ou 55 5658 1111 (apoio 24h).',
          'O 911 unifica atendimento de polícia, médicos e bombeiros em todo o território mexicano.',
        ],
      },
      {
        country: 'Uruguai',
        city: 'Montevidéu',
        countryCode: 'UY',
        policeNumber: '911',
        medicalEmergencyNumber: '105',
        generalEmergencyNumber: '911',
        consulateEmbassyName: 'Consulado-Geral do Brasil em Montevidéu',
        consulateAddress: 'Bulevar General Artigas 1256, 11300 Montevideo',
        consulatePhone: '+598 2707 2119',
        consulateEmail: 'cg.montevideu@itamaraty.gov.br',
        consulateEmergency24h: '+598 99 642 419 (Plantão Consular 24h Montevidéu)',
        safeHavens: [
          {
            name: 'Aeroporto Internacional de Carrasco (MVD)',
            type: 'Aeroporto Internacional 24h',
            address: 'Ruta 101 Km 19.999, 14000 Ciudad de la Costa',
            notes: 'Posto da Polícia Aérea Nacional e serviços de emergência 24h.',
          },
          {
            name: 'Hospital de Clínicas Dr. Manuel Quintela',
            type: 'Hospital Universitário Público de Emergência',
            address: 'Av. Italia s/n, 11600 Montevideo',
            notes: 'Pronto-socorro central de referência pública 24h em Montevidéu.',
          },
        ],
        travelTips: [
          'Linha de apoio a mulheres no Uruguai: 0800 4141 ou *4141 de celular (gratuito e confidencial).',
          'Cidadãos brasileiros podem ingressar no Uruguai apenas com RG em bom estado ou passaporte.',
        ],
      },
    ]

    const destCol = app.findCollectionByNameOrId('destinations')
    for (let i = 0; i < additionalDests.length; i++) {
      const d = additionalDests[i]
      try {
        const existing = app.findFirstRecordByData('destinations', 'country', d.country)
        existing.set('city', d.city)
        existing.set('country_code', d.countryCode)
        existing.set('police_number', d.policeNumber)
        existing.set('medical_emergency_number', d.medicalEmergencyNumber)
        existing.set('general_emergency_number', d.generalEmergencyNumber)
        existing.set('consulate_embassy_name', d.consulateEmbassyName)
        existing.set('consulate_address', d.consulateAddress)
        existing.set('consulate_phone', d.consulatePhone)
        existing.set('consulate_email', d.consulateEmail)
        existing.set('consulate_emergency_24h', d.consulateEmergency24h)
        existing.set('safe_havens', d.safeHavens)
        existing.set('travel_tips', d.travelTips)
        app.save(existing)
      } catch (_) {
        const rec = new Record(destCol)
        rec.set('country', d.country)
        rec.set('city', d.city)
        rec.set('country_code', d.countryCode)
        rec.set('police_number', d.policeNumber)
        rec.set('medical_emergency_number', d.medicalEmergencyNumber)
        rec.set('general_emergency_number', d.generalEmergencyNumber)
        rec.set('consulate_embassy_name', d.consulateEmbassyName)
        rec.set('consulate_address', d.consulateAddress)
        rec.set('consulate_phone', d.consulatePhone)
        rec.set('consulate_email', d.consulateEmail)
        rec.set('consulate_emergency_24h', d.consulateEmergency24h)
        rec.set('safe_havens', d.safeHavens)
        rec.set('travel_tips', d.travelTips)
        app.save(rec)
      }
    }
  },
  (app) => {},
)
