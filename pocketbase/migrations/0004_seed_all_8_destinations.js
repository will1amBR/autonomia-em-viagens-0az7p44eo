migrate(
  (app) => {
    const dests = [
      {
        country: 'Itália',
        city: 'Roma',
        countryCode: 'IT',
        policeNumber: '112 / 113',
        medicalEmergencyNumber: '118',
        generalEmergencyNumber: '112 (Número Único Europeu)',
        consulateEmbassyName: 'Embaixada e Consulado-Geral do Brasil em Roma',
        consulateAddress: 'Piazza Navona, 14 - 00186 Roma',
        consulatePhone: '+39 06 6889 661',
        consulateEmail: 'consular.roma@itamaraty.gov.br',
        consulateEmergency24h: '+39 333 306 4545 (Plantão Consular 24h)',
        safeHavens: [
          {
            name: 'Aeroporto Internacional Leonardo da Vinci (Fiumicino)',
            type: 'Aeroporto / Ponto de Apoio 24h',
            address: "Via dell' Aeroporto di Fiumicino, 320, 00054 Fiumicino RM",
            notes:
              'Possui posto de polícia de fronteira 24h, balcões de companhias aéreas e conexão de trem direta para Roma Termini.',
          },
          {
            name: 'Estação Central Roma Termini (Polfer - Polícia Ferroviária)',
            type: 'Estação de Trem e Segurança',
            address: 'Piazza dei Cinquecento, 00185 Roma RM',
            notes:
              'Área com constante policiamento (Carabinieri/Polizia di Stato), caixas eletrônicos e farmácia 24h.',
          },
          {
            name: 'Ospedale Policlinico Umberto I',
            type: 'Hospital Público de Emergência (Pronto Soccorso)',
            address: 'Viale del Policlinico, 155, 00161 Roma RM',
            notes: 'Atendimento médico de urgência 24 horas.',
          },
        ],
        travelTips: [
          'O número 112 atende em italiano e inglês em todo o território nacional.',
          'A posse física do passaporte é direito seu; hotéis só podem anotar os dados e devolver imediatamente o documento.',
          'Linha de apoio a mulheres na Itália: 1522 (gratuito e 24h).',
        ],
      },
      {
        country: 'França',
        city: 'Paris',
        countryCode: 'FR',
        policeNumber: '17 / 112',
        medicalEmergencyNumber: '15 (SAMU)',
        generalEmergencyNumber: '112',
        consulateEmbassyName: 'Consulado-Geral do Brasil em Paris',
        consulateAddress: '65 Avenue Franklin Delano Roosevelt, 75008 Paris',
        consulatePhone: '+33 1 45 61 63 00',
        consulateEmail: 'cg.paris@itamaraty.gov.br',
        consulateEmergency24h: '+33 6 80 12 32 34 (Plantão Consular 24h)',
        safeHavens: [
          {
            name: 'Aeroporto Charles de Gaulle (CDG)',
            type: 'Aeroporto Internacional',
            address: '95700 Roissy-en-France',
            notes:
              'Acesso RER B, terminais abertos 24h com postos policiais da PAF (Police aux Frontières).',
          },
          {
            name: 'Hôpital Hôtel-Dieu de Paris (Parvis Notre-Dame)',
            type: 'Hospital Público de Emergência Central',
            address: '1 Parvis Notre-Dame - Pl. Jean-Paul II, 75004 Paris',
            notes: 'Atendimento médico de urgência 24 horas no centro de Paris.',
          },
        ],
        travelTips: [
          'Número 112 ou 17 para polícia em toda a França.',
          'Linha de apoio à violência e vulnerabilidade feminina na França: 3919 (violences femmes info).',
        ],
      },
      {
        country: 'Portugal',
        city: 'Lisboa',
        countryCode: 'PT',
        policeNumber: '112 (GNR / PSP)',
        medicalEmergencyNumber: '112 (INEM)',
        generalEmergencyNumber: '112',
        consulateEmbassyName: 'Consulado-Geral do Brasil em Lisboa',
        consulateAddress: 'Praça Luís de Camões, 22, 1200-243 Lisboa',
        consulatePhone: '+351 21 321 4100',
        consulateEmail: 'cg.lisboa@itamaraty.gov.br',
        consulateEmergency24h: '+351 96 252 0581 (Plantão Consular 24h)',
        safeHavens: [
          {
            name: 'Aeroporto Humberto Delgado (Lisboa)',
            type: 'Aeroporto Internacional',
            address: 'Alameda das Comunidades Portuguesas, 1700-111 Lisboa',
            notes: 'Conexão de metrô (Linha Vermelha) e posto da PSP 24h.',
          },
          {
            name: 'Hospital de Santa Maria (CHULN)',
            type: 'Hospital Universitário de Referência 24h',
            address: 'Av. Prof. Egas Moniz, 1649-035 Lisboa',
            notes: 'Grande urgência central de Lisboa com atendimento integral.',
          },
        ],
        travelTips: [
          'Apoio à vítima e mulheres em Portugal: Linha 144 (Emergência Social) e 800 202 148 (CIG).',
          'Consulado emite Autorização de Retorno ao Brasil (ARB) em casos de perda/roubo.',
        ],
      },
      {
        country: 'Espanha',
        city: 'Madri',
        countryCode: 'ES',
        policeNumber: '112 / 091 (Policía Nacional)',
        medicalEmergencyNumber: '112 / 061 (SAMUR)',
        generalEmergencyNumber: '112',
        consulateEmbassyName: 'Consulado-Geral do Brasil em Madri',
        consulateAddress: 'Calle de Fernando el Santo, 6, 28010 Madrid',
        consulatePhone: '+34 91 700 4650',
        consulateEmail: 'cg.madri@itamaraty.gov.br',
        consulateEmergency24h: '+34 677 547 004 (Plantão Consular 24h Madri)',
        safeHavens: [
          {
            name: 'Aeropuerto Adolfo Suárez Madrid-Barajas',
            type: 'Aeroporto Internacional 24h',
            address: 'Av de la Hispanidad, s/n, 28042 Madrid',
            notes: 'Posto de comissaria da Polícia Nacional 24h (Terminais T1 e T4).',
          },
          {
            name: 'Hospital Universitario La Paz',
            type: 'Hospital Público de Urgência',
            address: 'P.º de la Castellana, 261, 28046 Madrid',
            notes: 'Atendimento de urgência e trauma 24 horas.',
          },
        ],
        travelTips: [
          'Linha de apoio contra violência à mulher na Espanha: 016 (não deixa registro na fatura telefônica).',
          'Emergência geral 112 atende em múltiplos idiomas sem custo.',
        ],
      },
      {
        country: 'Reino Unido',
        city: 'Londres',
        countryCode: 'GB',
        policeNumber: '999 (Emergência) / 101 (Não-emergência)',
        medicalEmergencyNumber: '999 / 111 (NHS Direct)',
        generalEmergencyNumber: '999 ou 112',
        consulateEmbassyName: 'Embaixada e Consulado-Geral do Brasil em Londres',
        consulateAddress: '14-16 Cockspur Street, London SW1Y 5BL',
        consulatePhone: '+44 20 7747 4500',
        consulateEmail: 'cg.londres@itamaraty.gov.br',
        consulateEmergency24h: '+44 77 2021 4422 (Plantão Consular 24h)',
        safeHavens: [
          {
            name: 'Heathrow Airport (LHR) - Police Station',
            type: 'Aeroporto Internacional / Posto Policial 24h',
            address: 'Hounslow TW6 1AP, London',
            notes: 'Metropolitan Police Station em todos os terminais com trens Heathrow Express.',
          },
          {
            name: "St Thomas' Hospital (Emergency Department)",
            type: 'Hospital Central NHS',
            address: 'Westminster Bridge Rd, London SE1 7EH',
            notes: 'Pronto-socorro 24h localizado em frente ao Parlamento Britânico.',
          },
        ],
        travelTips: [
          'Linha Nacional de Apoio a Mulheres no Reino Unido (Refuge): 0808 2000 247 (gratuito 24h).',
          'Ligue 999 em situações de perigo iminente ou 111 para orientações médicas urgentes.',
        ],
      },
      {
        country: 'Estados Unidos',
        city: 'Nova York / Washington',
        countryCode: 'US',
        policeNumber: '911',
        medicalEmergencyNumber: '911',
        generalEmergencyNumber: '911',
        consulateEmbassyName: 'Consulado-Geral do Brasil em Nova York / Washington',
        consulateAddress: '225 E 41st St, New York, NY 10017',
        consulatePhone: '+1 917 777 7777',
        consulateEmail: 'cg.novayork@itamaraty.gov.br',
        consulateEmergency24h: '+1 646 405 3352 (Plantão Consular 24h NY)',
        safeHavens: [
          {
            name: 'John F. Kennedy International Airport (JFK)',
            type: 'Aeroporto Internacional 24h',
            address: 'Queens, NY 11430',
            notes: 'Port Authority Police Department (PAPD) 24h em todos os terminais.',
          },
          {
            name: 'Bellevue Hospital Center',
            type: 'Hospital Público de Trauma e Emergência 24h',
            address: '462 1st Avenue, New York, NY 10016',
            notes: 'Centro de trauma de nível 1 com assistência em dezenas de línguas.',
          },
        ],
        travelTips: [
          'Linha Nacional contra Violência Doméstica nos EUA: 1-800-799-SAFE (7233) ou envie START para 88788.',
          'Ligue 911 de qualquer celular ativo sem necessidade de saldo.',
        ],
      },
      {
        country: 'Argentina',
        city: 'Buenos Aires',
        countryCode: 'AR',
        policeNumber: '911 (Policía de la Ciudad) / 101',
        medicalEmergencyNumber: '107 (SAME)',
        generalEmergencyNumber: '911',
        consulateEmbassyName: 'Embaixada e Consulado-Geral do Brasil em Buenos Aires',
        consulateAddress: 'Av. Carlos Pellegrini, 1363, C1011AAA Buenos Aires',
        consulatePhone: '+54 11 4515 2400',
        consulateEmail: 'consular.baires@itamaraty.gov.br',
        consulateEmergency24h: '+54 9 11 4199 9668 (Plantão Consular 24h)',
        safeHavens: [
          {
            name: 'Aeroporto Internacional Ministro Pistarini (Ezeiza)',
            type: 'Aeroporto Internacional',
            address: 'AU Tte. Gral. Pablo Riccheri Km 33,5, B1802 Ezeiza',
            notes: 'Posto da Policía de Seguridad Aeroportuaria (PSA) 24 horas.',
          },
          {
            name: 'Hospital General de Agudos Dr. Juan A. Fernández',
            type: 'Hospital Público de Urgência',
            address: 'Cerviño 3356, C1425AGP Buenos Aires',
            notes: 'Hospital público de referência em emergências e traumas 24h.',
          },
        ],
        travelTips: [
          'Linha 144 na Argentina: atenção e contenção para mulheres em situação de vulnerabilidade/violência 24h.',
          'Ambulância pública SAME atende gratuitamente pelo 107.',
        ],
      },
      {
        country: 'Japão',
        city: 'Tóquio',
        countryCode: 'JP',
        policeNumber: '110 (Polícia)',
        medicalEmergencyNumber: '119 (Ambulância e Bombeiros)',
        generalEmergencyNumber: '110 / 119',
        consulateEmbassyName: 'Embaixada e Consulado-Geral do Brasil em Tóquio',
        consulateAddress: '2-11-12 Kita-Aoyama, Minato-ku, Tokyo 107-8633',
        consulatePhone: '+81 3 3404 5211',
        consulateEmail: 'consular.toquio@itamaraty.gov.br',
        consulateEmergency24h: '+81 90 1445 5473 (Plantão Consular 24h Tóquio)',
        safeHavens: [
          {
            name: 'Aeroporto Internacional de Tóquio-Haneda (HND)',
            type: 'Aeroporto Internacional 24h',
            address: 'Hanedakuko, Ota City, Tokyo 144-0041',
            notes: 'Polícia do aeroporto e clínicas de emergência nos terminais 2 e 3.',
          },
          {
            name: "St. Luke's International Hospital (Seiroka)",
            type: 'Hospital Internacional com Atendimento em Inglês',
            address: '9-1 Akashicho, Chuo City, Tokyo 104-8560',
            notes: 'Pronto-socorro 24h com suporte a estrangeiros.',
          },
          {
            name: 'Koban (Posto Policial de Bairro)',
            type: 'Postos Policiais de Proximidade',
            address: 'Presentes em todas as estações de trem de Tóquio',
            notes: 'Oficiais (omawari-san) oferecem orientação, mapas e abrigo imediato.',
          },
        ],
        travelTips: [
          'TELL Lifeline no Japão: suporte confidencial em inglês pelo 03-5774-0992.',
          'Postos Koban estão em quase todas as esquinas e estações de trem para apoio imediato.',
        ],
      },
    ]

    const destCol = app.findCollectionByNameOrId('destinations')
    for (let i = 0; i < dests.length; i++) {
      const d = dests[i]
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
