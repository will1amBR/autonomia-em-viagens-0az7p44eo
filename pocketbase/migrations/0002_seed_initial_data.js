migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')

    // 1. Seed Admin user (william@korenambiental.com)
    try {
      const existing = app.findAuthRecordByEmail('_pb_users_auth_', 'william@korenambiental.com')
      existing.set('role', 'admin')
      existing.set('name', 'Administrador')
      app.save(existing)
    } catch (_) {
      const adminUser = new Record(users)
      adminUser.setEmail('william@korenambiental.com')
      adminUser.setPassword('Skip@Pass')
      adminUser.setVerified(true)
      adminUser.set('name', 'Administrador')
      adminUser.set('role', 'admin')
      adminUser.set('phone', '+55 11 99999-0000')
      adminUser.set('emergency_passcode', '9911')
      app.save(adminUser)
    }

    // 2. Seed Sample Traveler user (viajante@autonomia.com)
    let travelerId = ''
    try {
      const traveler = app.findAuthRecordByEmail('_pb_users_auth_', 'viajante@autonomia.com')
      travelerId = traveler.id
    } catch (_) {
      const traveler = new Record(users)
      traveler.setEmail('viajante@autonomia.com')
      traveler.setPassword('Skip@Pass')
      traveler.setVerified(true)
      traveler.set('name', 'Camila Rocha')
      traveler.set('role', 'user')
      traveler.set('phone', '+55 11 99887-7665')
      traveler.set('emergency_passcode', '9911')
      app.save(traveler)
      travelerId = traveler.id
    }

    // 3. Seed Destinations (Italy, France, Portugal, USA, Spain, UK, Argentina, Japan)
    const destinationsCol = app.findCollectionByNameOrId('destinations')
    const destinationsData = [
      {
        country: 'Itália',
        city: 'Roma',
        country_code: 'IT',
        police_number: '112 / 113',
        medical_emergency_number: '118',
        general_emergency_number: '112 (Número Único Europeu)',
        consulate_embassy_name: 'Embaixada e Consulado-Geral do Brasil em Roma',
        consulate_address: 'Piazza Navona, 14 - 00186 Roma',
        consulate_phone: '+39 06 6889 661',
        consulate_email: 'consular.roma@itamaraty.gov.br',
        consulate_emergency_24h: '+39 333 306 4545 (Plantão Consular 24h)',
        safe_havens: [
          {
            name: 'Aeroporto Internacional Leonardo da Vinci (Fiumicino)',
            type: 'Aeroporto / Ponto de Apoio 24h',
            address: "Via dell' Aeroporto di Fiumicino, 320, 00054 Fiumicino RM",
            notes: 'Posto de polícia de fronteira 24h e balcões de companhias aéreas.',
          },
          {
            name: 'Ospedale Policlinico Umberto I',
            type: 'Hospital Público de Emergência (Pronto Soccorso)',
            address: 'Viale del Policlinico, 155, 00161 Roma RM',
            notes: 'Atendimento médico de urgência 24 horas.',
          },
        ],
        travel_tips: [
          'O número 112 atende em italiano e inglês em todo o território nacional.',
          'A posse física do passaporte é direito seu; hotéis só podem anotar os dados e devolver o documento.',
        ],
      },
      {
        country: 'França',
        city: 'Paris',
        country_code: 'FR',
        police_number: '17',
        medical_emergency_number: '15 (SAMU)',
        general_emergency_number: '112 (Europeu)',
        consulate_embassy_name: 'Consulado-Geral do Brasil em Paris',
        consulate_address: '65 Avenue Franklin Delano Roosevelt, 75008 Paris',
        consulate_phone: '+33 1 45 61 63 00',
        consulate_email: 'cg.paris@itamaraty.gov.br',
        consulate_emergency_24h: '+33 6 80 12 32 34 (Plantão Consular 24h)',
        safe_havens: [
          {
            name: 'Aeroporto Charles de Gaulle (CDG)',
            type: 'Aeroporto Internacional',
            address: '95700 Roissy-en-France',
            notes: 'Acesso RER B, terminais abertos 24h com postos policiais da PAF.',
          },
          {
            name: 'Hôpital Hôtel-Dieu de Paris (AP-HP)',
            type: 'Hospital Central de Emergência',
            address: '1 Parvis Notre-Dame - Pl. Jean-Paul II, 75004 Paris',
            notes: 'Pronto-socorro central 24h.',
          },
        ],
        travel_tips: [
          'Documento de viagem válido é obrigatório para trânsito no espaço Schengen.',
          'Sempre compre bilhetes oficiais de transporte público.',
        ],
      },
      {
        country: 'Portugal',
        city: 'Lisboa',
        country_code: 'PT',
        police_number: '112 (GNR / PSP)',
        medical_emergency_number: '112 (INEM)',
        general_emergency_number: '112',
        consulate_embassy_name: 'Consulado-Geral do Brasil em Lisboa',
        consulate_address: 'Praça Luís de Camões, 22, 1200-243 Lisboa',
        consulate_phone: '+351 21 321 4100',
        consulate_email: 'cg.lisboa@itamaraty.gov.br',
        consulate_emergency_24h: '+351 96 252 0581 (Plantão Consular 24h)',
        safe_havens: [
          {
            name: 'Aeroporto Humberto Delgado (Lisboa)',
            type: 'Aeroporto Internacional',
            address: 'Alameda das Comunidades Portuguesas, 1700-111 Lisboa',
            notes: 'Conexão de metrô Linha Vermelha e posto da PSP 24h.',
          },
          {
            name: 'Hospital de São José (CHULC)',
            type: 'Hospital Central de Urgência',
            address: 'Rua José António Serrano, 1150-199 Lisboa',
            notes: 'Serviço de urgência geral 24h.',
          },
        ],
        travel_tips: [
          'A língua facilita o contato, mas mantenha suas reservas financeiras protegidas.',
          'Em perda documental, o Consulado emite ARB de emergência.',
        ],
      },
      {
        country: 'Estados Unidos',
        city: 'Miami',
        country_code: 'US',
        police_number: '911',
        medical_emergency_number: '911',
        general_emergency_number: '911',
        consulate_embassy_name: 'Consulado-Geral do Brasil em Miami',
        consulate_address: '3150 SW 38th Ave, Suite 100, Miami, FL 33146',
        consulate_phone: '+1 305 285 6200',
        consulate_email: 'consbras.miami@itamaraty.gov.br',
        consulate_emergency_24h: '+1 305 342 0713 (Plantão Consular 24h)',
        safe_havens: [
          {
            name: 'Miami International Airport (MIA)',
            type: 'Aeroporto Internacional',
            address: '2100 NW 42nd Ave, Miami, FL 33142',
            notes: 'Área segura com polícia do condado de Miami-Dade e TSA 24h.',
          },
          {
            name: 'Jackson Memorial Hospital (Ryder Trauma Center)',
            type: 'Hospital de Trauma e Emergência',
            address: '1611 NW 12th Ave, Miami, FL 33136',
            notes: 'Centro de trauma e pronto-atendimento 24h.',
          },
        ],
        travel_tips: [
          'Seguro viagem nos EUA é indispensável devido aos altíssimos custos de saúde privada.',
          'O 911 funciona de qualquer celular ativo mesmo sem chip ou crédito.',
        ],
      },
      {
        country: 'Espanha',
        city: 'Madri',
        country_code: 'ES',
        police_number: '112 / 091 (Policía Nacional)',
        medical_emergency_number: '112 / 061 (SAMUR)',
        general_emergency_number: '112',
        consulate_embassy_name: 'Consulado-Geral do Brasil em Madri',
        consulate_address: 'Calle de Fernando el Santo, 6, 28010 Madrid',
        consulate_phone: '+34 91 700 4650',
        consulate_email: 'cg.madri@itamaraty.gov.br',
        consulate_emergency_24h:
          '+34 677 547 004 (Plantão Consular 24h Madri) / +34 659 078 057 (Barcelona)',
        safe_havens: [
          {
            name: 'Aeropuerto Adolfo Suárez Madrid-Barajas',
            type: 'Aeroporto Internacional 24h',
            address: 'Av de la Hispanidad, s/n, 28042 Madrid',
            notes: 'Posto de comissaria da Polícia Nacional 24h (Terminais T1 e T4).',
          },
          {
            name: 'Hospital Universitario La Paz',
            type: 'Hospital Público de Urgência',
            address: 'P.º de la Castellana, 261, Fuencarral-El Pardo, 28046 Madrid',
            notes: 'Atendimento de urgência e trauma 24 horas.',
          },
          {
            name: 'Consulado-Geral do Brasil em Barcelona',
            type: 'Apoio Consular Regional',
            address: 'Av. Diagonal, 468, 2º, 08006 Barcelona',
            notes: 'Telefone: +34 93 488 2288.',
          },
        ],
        travel_tips: [
          'O número de emergência 112 é gratuito e funciona mesmo sem sinal de operadora local.',
          'Mantenha sempre documento oficial de identificação consigo. Exija sempre a posse física do seu passaporte.',
          'Em caso de furto na Espanha, a denúncia pode ser feita na Delegacia de Turismo da Polícia Nacional.',
        ],
      },
      {
        country: 'Reino Unido',
        city: 'Londres',
        country_code: 'GB',
        police_number: '999 (Emergência) / 101 (Não-emergência)',
        medical_emergency_number: '999 / 111 (NHS Direct)',
        general_emergency_number: '999 ou 112',
        consulate_embassy_name: 'Embaixada e Consulado-Geral do Brasil em Londres',
        consulate_address: '14-16 Cockspur Street, London SW1Y 5BL',
        consulate_phone: '+44 20 7747 4500',
        consulate_email: 'cg.londres@itamaraty.gov.br',
        consulate_emergency_24h: '+44 77 2021 4422 (Plantão Consular 24h)',
        safe_havens: [
          {
            name: 'Heathrow Airport (LHR) - Police Station',
            type: 'Aeroporto Internacional / Posto Policial 24h',
            address: 'Hounslow TW6 1AP, London',
            notes:
              'Metropolitan Police Station em todos os terminais com trens Heathrow Express para Paddington.',
          },
          {
            name: "St Thomas' Hospital (Emergency Department)",
            type: 'Hospital Central NHS',
            address: 'Westminster Bridge Rd, London SE1 7EH',
            notes: 'Pronto-socorro 24h localizado em frente ao Parlamento Britânico.',
          },
        ],
        travel_tips: [
          'O Reino Unido exige passaporte válido durante toda a estadia (brasileiros a turismo não precisam de visto prévio por até 6 meses).',
          'O serviço de emergência 999 conecta diretamente polícia, ambulância e bombeiros.',
          'Em situações médicas urgentes que não sejam risco iminente de morte, ligue 111 para triagem pelo NHS.',
        ],
      },
      {
        country: 'Argentina',
        city: 'Buenos Aires',
        country_code: 'AR',
        police_number: '911 (Policía de la Ciudad) / 101',
        medical_emergency_number: '107 (SAME)',
        general_emergency_number: '911',
        consulate_embassy_name: 'Embaixada e Consulado-Geral do Brasil em Buenos Aires',
        consulate_address: 'Av. Carlos Pellegrini, 1363, C1011AAA Buenos Aires',
        consulate_phone: '+54 11 4515 2400',
        consulate_email: 'consular.baires@itamaraty.gov.br',
        consulate_emergency_24h: '+54 9 11 4199 9668 (Plantão Consular 24h)',
        safe_havens: [
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
          {
            name: 'Comisaría del Turista de la Ciudad de Buenos Aires',
            type: 'Polícia Especializada de Turismo',
            address: 'Av. Corrientes 436, C1043AAR Buenos Aires',
            notes: 'Atendimento prioritário a turistas estrangeiros com tradutores.',
          },
        ],
        travel_tips: [
          'Brasileiros podem entrar na Argentina com RG recente em bom estado ou Passaporte válido.',
          'O serviço de ambulância pública SAME atende pelo 107 sem custos.',
          'Tenha sempre moeda local (pesos) ou cartão internacional aceito em caixas e estabelecimentos.',
        ],
      },
      {
        country: 'Japão',
        city: 'Tóquio',
        country_code: 'JP',
        police_number: '110 (Polícia)',
        medical_emergency_number: '119 (Ambulância e Bombeiros)',
        general_emergency_number: '110 (Polícia) / 119 (Ambulância)',
        consulate_embassy_name: 'Embaixada do Brasil em Tóquio',
        consulate_address: '2-11-12 Kita-Aoyama, Minato-ku, Tokyo 107-8633',
        consulate_phone: '+81 3 3404 5211',
        consulate_email: 'consular.toquio@itamaraty.gov.br',
        consulate_emergency_24h:
          '+81 90 1445 5473 (Plantão Consular 24h Tóquio) / +81 90 2136 0888 (Nagoia)',
        safe_havens: [
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
        travel_tips: [
          'Desde 2023, brasileiros titulares de passaporte comum eletrônico estão isentos de visto para estadias de até 90 dias a turismo.',
          'O número 110 atende a polícia e o 119 ambulâncias (em inglês e japonês).',
          'Mantenha sempre seu passaporte físico consigo; a lei japonesa exige porte obrigatório por estrangeiros.',
        ],
      },
    ]

    for (const d of destinationsData) {
      try {
        const rec = app.findFirstRecordByData('destinations', 'country', d.country)
        rec.set('city', d.city)
        rec.set('country_code', d.country_code)
        rec.set('police_number', d.police_number)
        rec.set('medical_emergency_number', d.medical_emergency_number)
        rec.set('general_emergency_number', d.general_emergency_number)
        rec.set('consulate_embassy_name', d.consulate_embassy_name)
        rec.set('consulate_address', d.consulate_address)
        rec.set('consulate_phone', d.consulate_phone)
        rec.set('consulate_email', d.consulate_email)
        rec.set('consulate_emergency_24h', d.consulate_emergency_24h)
        rec.set('safe_havens', d.safe_havens)
        rec.set('travel_tips', d.travel_tips)
        app.save(rec)
      } catch (_) {
        const rec = new Record(destinationsCol)
        rec.set('country', d.country)
        rec.set('city', d.city)
        rec.set('country_code', d.country_code)
        rec.set('police_number', d.police_number)
        rec.set('medical_emergency_number', d.medical_emergency_number)
        rec.set('general_emergency_number', d.general_emergency_number)
        rec.set('consulate_embassy_name', d.consulate_embassy_name)
        rec.set('consulate_address', d.consulate_address)
        rec.set('consulate_phone', d.consulate_phone)
        rec.set('consulate_email', d.consulate_email)
        rec.set('consulate_emergency_24h', d.consulate_emergency_24h)
        rec.set('safe_havens', d.safe_havens)
        rec.set('travel_tips', d.travel_tips)
        app.save(rec)
      }
    }

    // 4. Seed Security Library (11 items)
    const libCol = app.findCollectionByNameOrId('security_library')
    const libData = [
      {
        slug: 'retencao-passaporte',
        title: 'Retenção de passaporte por outra pessoa',
        icon_name: 'FileLock',
        urgency_level: 'critica',
        short_summary:
          'Ninguém tem o direito legal de confiscar seu passaporte ou documento de identidade no exterior.',
        immediate_steps: [
          'Vá com calma até um local público e seguro (hotel com recepção 24h, aeroporto, delegacia de polícia).',
          'Não confronte fisicamente a pessoa caso sinta risco à sua integridade física.',
          'Ligue para a polícia local (112 na Europa, 911 nos EUA) e relate que seu documento foi retido.',
          'Entre em contato imediatamente com o Plantão Consular do Brasil no país para emissão de ARB.',
          'Acione seu Guardian de segurança através do aplicativo.',
        ],
        what_not_to_do: [
          'Não tente recuperar à força caso haja risco de agressão.',
          'Não assine nenhum documento de renúncia de direitos que não compreenda.',
        ],
        rights_and_resources: [
          'O passaporte é propriedade do governo emissor; reter documento de terceiro configura crime na maioria dos países.',
          'Consulados brasileiros prestam auxílio imediato para emissão de Autorização de Retorno ao Brasil.',
        ],
      },
      {
        slug: 'perda-documentos',
        title: 'Perda ou furto de documentos no exterior',
        icon_name: 'FileQuestion',
        urgency_level: 'moderada',
        short_summary:
          'Passo a passo rápido para registrar boletim e obter retorno seguro ao Brasil.',
        immediate_steps: [
          'Procure a delegacia de polícia local mais próxima e registre a ocorrência policial (Police Report).',
          'Acesse as cópias digitais salvas no aplicativo ou e-mail seguro.',
          'Contate o Consulado Brasileiro mais próximo informando a data do seu voo de retorno.',
          'Solicite a emissão do Passaporte de Emergência ou Autorização de Retorno ao Brasil (ARB).',
        ],
        what_not_to_do: [
          'Não deixe para ir ao consulado poucas horas antes do voo sem antes contatar o plantão.',
        ],
        rights_and_resources: [
          'A ARB é emitida com rapidez para permitir o retorno direto ao país de origem.',
        ],
      },
      {
        slug: 'impedido-de-sair',
        title: 'Impedido(a) de sair da hospedagem ou trancado(a)',
        icon_name: 'DoorClosed',
        urgency_level: 'critica',
        short_summary:
          'Privação de liberdade é crime grave. Sua prioridade máxima é comunicação de emergência e segurança.',
        immediate_steps: [
          'Ligue imediatamente para o número de emergência da polícia local (112, 911, 999).',
          'Ative o Emergency Mode no aplicativo para enviar sua localização e alerta aos seus Guardians.',
          'Se não puder falar, envie mensagem de texto ao Guardian com seu endereço exato.',
          'Permaneça perto de janelas ou acessos visíveis se for seguro chamar atenção.',
        ],
        what_not_to_do: ['Não anuncie suas intenções caso a outra pessoa esteja alterada.'],
        rights_and_resources: [
          'Polícias locais tratam cárcere com intervenção prioritária imediata.',
        ],
      },
      {
        slug: 'sem-dinheiro',
        title: 'Fiquei sem dinheiro ou acesso a fundos',
        icon_name: 'CreditCardOff',
        urgency_level: 'alta',
        short_summary:
          'Recursos imediatos para garantir alimentação, abrigo e emissão de passagem.',
        immediate_steps: [
          'Contate seu Guardian para envio de remessa emergencial via Western Union, Wise ou Pix.',
          'Se não tiver hospedagem, dirija-se a um aeroporto internacional ou estação central com funcionamento 24h.',
          'Contate o serviço consular brasileiro para canais de apoio humanitário.',
        ],
        what_not_to_do: ['Não aceite ofertas de desconhecidos condicionadas a trabalho irregular.'],
        rights_and_resources: [
          'Serviços como Western Union permitem retirada de dinheiro em espécie na boca do caixa.',
        ],
      },
      {
        slug: 'perda-celular',
        title: 'Perda ou roubo do celular no exterior',
        icon_name: 'SmartphoneOff',
        urgency_level: 'alta',
        short_summary: 'Como recuperar acesso às comunicações e proteger seus dados.',
        immediate_steps: [
          'Acesse um computador público seguro e bloqueie o aparelho via iCloud / Google Find My.',
          'Compre um chip local pré-pago barato ou use WhatsApp Web seguro para avisar seus contatos.',
          'Notifique seus Guardians de que você está temporariamente com novo número.',
        ],
        what_not_to_do: ['Não deixe de avisar seus contatos de emergência.'],
        rights_and_resources: [
          'Consulados possuem terminais e telefones para contato de emergência com familiares.',
        ],
      },
      {
        slug: 'ameaca',
        title: 'Ameaças verbais, chantagem ou intimidação',
        icon_name: 'ShieldAlert',
        urgency_level: 'critica',
        short_summary: 'Como agir quando a convivência se torna ameaçadora ou controladora.',
        immediate_steps: [
          'Priorize sair do mesmo ambiente físico com calma e sem confronto direto.',
          'Vá para um café, lobby de hotel de grande rede ou posto de transporte público.',
          'Documente prints e anotações das ameaças em sua nuvem segura.',
          'Acione seu Guardian de nível de emergência.',
        ],
        what_not_to_do: ['Não responda com ameaças recíprocas que possam escalar o conflito.'],
        rights_and_resources: [
          'Você tem o direito inalienável de encerrar a viagem e voltar a qualquer momento.',
        ],
      },
      {
        slug: 'agressao',
        title: 'Agressão física ou violência',
        icon_name: 'HeartCrack',
        urgency_level: 'critica',
        short_summary: 'Atendimento médico imediato, proteção policial e suporte consular.',
        immediate_steps: [
          'Afaste-se imediatamente do agressor e busque socorro de autoridades.',
          'Ligue para a emergência médica e policial (112 / 911 / 999).',
          'Procure o Pronto Socorro mais próximo para atendimento e relatório de lesões.',
          'Acione o Plantão Consular brasileiro.',
        ],
        what_not_to_do: ['Não retorne ao local compartilhado desacompanhado(a) da polícia.'],
        rights_and_resources: [
          'Vítimas de violência possuem canais de atendimento especializado e abrigo temporário.',
        ],
      },
      {
        slug: 'perseguicao',
        title: 'Suspeita de perseguição ou vigilância',
        icon_name: 'EyeOff',
        urgency_level: 'alta',
        short_summary: 'Como despistar e buscar proteção em locais monitorados e movimentados.',
        immediate_steps: [
          'Entre imediatamente em um estabelecimento comercial movimentado (shopping, hotel conceituado).',
          'Comunique a segurança privada do local sobre a pessoa que está te seguindo.',
          'Peça um táxi ou transporte oficial de dentro do estabelecimento fechado.',
        ],
        what_not_to_do: [
          'Não vá para um beco escuro ou para o seu local de hospedagem se estiver sendo seguido(a).',
        ],
        rights_and_resources: [
          'Grandes estações e centros urbanos possuem monitoramento por câmeras policiais.',
        ],
      },
      {
        slug: 'nao-sei-onde-estou',
        title: 'Perdido(a) ou sem localização conhecida',
        icon_name: 'Compass',
        urgency_level: 'moderada',
        short_summary: 'Como recuperar sua orientação e compartilhar coordenadas precisas.',
        immediate_steps: [
          'Abra o mapa do celular ou conecte-se a um Wi-Fi público e compartilhe seu PIN de localização com o Guardian.',
          'Identifique o nome da rua mais próxima e número de edificação.',
          'Dirija-se a uma farmácia, posto de combustível ou estação de metrô.',
        ],
        what_not_to_do: [
          'Não continue caminhando a esmo para bairros desconhecidos sem iluminação.',
        ],
        rights_and_resources: [
          'A maioria dos aplicativos de transporte permite solicitar corrida com o GPS do ponto atual.',
        ],
      },
      {
        slug: 'suspeita-exploracao',
        title: 'Suspeita de exploração ou promessa de emprego falsa',
        icon_name: 'AlertTriangle',
        urgency_level: 'critica',
        short_summary:
          'Identificação de armadilhas de trabalho irregular, retenção salarial ou tráfico velado.',
        immediate_steps: [
          'Não entregue seus documentos a empregadores informais ou intermediários sob pretexto algum.',
          'Recuse propostas com cobrança de taxas de hospedagem que criem dívidas.',
          'Contate a Embaixada/Consulado do Brasil e linhas nacionais de apoio a trabalhadores.',
        ],
        what_not_to_do: ['Não confie em promessas verbais que contradigam a lei do país.'],
        rights_and_resources: [
          'Linhas telefônicas gratuitas internacionais atendem anonimamente denúncias de exploração.',
        ],
      },
      {
        slug: 'preciso-sair-imediatamente',
        title: 'Preciso sair imediatamente e voltar para o Brasil',
        icon_name: 'PlaneTakeoff',
        urgency_level: 'critica',
        short_summary: 'Protocolo de saída emergencial e retorno seguro para casa.',
        immediate_steps: [
          'Pegue seus itens essenciais prioritários: Passaporte, celular, cartões/dinheiro e medicação.',
          'Dirija-se diretamente ao aeroporto internacional ou estação central.',
          'No aeroporto, vá ao balcão da companhia aérea ou use seu cartão internacional para emitir o voo disponível.',
          'Avise seu Guardian de que você está no aeroporto aguardando embarque.',
        ],
        what_not_to_do: [
          'Não perca tempo tentando carregar malas pesadas se isso colocar sua saída em risco.',
        ],
        rights_and_resources: [
          'Aeroportos internacionais são zonas controladas de alta segurança com presença policial permanente.',
        ],
      },
    ]

    for (const item of libData) {
      try {
        const rec = app.findFirstRecordByData('security_library', 'slug', item.slug)
        rec.set('title', item.title)
        rec.set('icon_name', item.icon_name)
        rec.set('urgency_level', item.urgency_level)
        rec.set('short_summary', item.short_summary)
        rec.set('immediate_steps', item.immediate_steps)
        rec.set('what_not_to_do', item.what_not_to_do)
        rec.set('rights_and_resources', item.rights_and_resources)
        app.save(rec)
      } catch (_) {
        const rec = new Record(libCol)
        rec.set('slug', item.slug)
        rec.set('title', item.title)
        rec.set('icon_name', item.icon_name)
        rec.set('urgency_level', item.urgency_level)
        rec.set('short_summary', item.short_summary)
        rec.set('immediate_steps', item.immediate_steps)
        rec.set('what_not_to_do', item.what_not_to_do)
        rec.set('rights_and_resources', item.rights_and_resources)
        app.save(rec)
      }
    }

    // 5. Seed Initial Trip for traveler
    if (travelerId) {
      const tripsCol = app.findCollectionByNameOrId('trips')
      let tripRecordId = ''
      try {
        const existingTrip = app.findFirstRecordByData('trips', 'user_id', travelerId)
        tripRecordId = existingTrip.id
      } catch (_) {
        const tripRec = new Record(tripsCol)
        tripRec.set('user_id', travelerId)
        tripRec.set('title', 'Viagem a Roma e Centro Histórico')
        tripRec.set('destination_country', 'Itália')
        tripRec.set('destination_city', 'Roma')
        tripRec.set('departure_date', '2025-05-12')
        tripRec.set('return_date', '2025-05-27')
        tripRec.set('trip_reason', 'Férias e convite pessoal')
        tripRec.set('accommodation_type', 'Apartamento alugado / Anfitrião')
        tripRec.set('accommodation_address', 'Via Nazionale, 114 - Roma RM, Itália')
        tripRec.set(
          'who_is_paying',
          'Pessoa conhecida recentemente assumindo passagens e hospedagem',
        )
        tripRec.set('traveling_with', 'Acompanhante / Convite pessoal')
        tripRec.set('host_responsible_person', 'Marco Bellini')
        tripRec.set('destination_contact', '+39 345 987 6543')
        tripRec.set('quick_notes', 'Código da mala: 384. Endereço do consulado salvo.')
        tripRec.set('checkin_frequency', 'daily_once')
        tripRec.set('checkin_preferred_time', '21:00')
        tripRec.set('checkin_active', true)
        app.save(tripRec)
        tripRecordId = tripRec.id

        // Seed Assessment for this trip
        const assessmentsCol = app.findCollectionByNameOrId('assessments')
        const assessmentRec = new Record(assessmentsCol)
        assessmentRec.set('user_id', travelerId)
        assessmentRec.set('trip_id', tripRecordId)
        assessmentRec.set('overall_score', 62)
        assessmentRec.set('tier', 'MODERATE')
        assessmentRec.set(
          'summary_text',
          'Você possui alguma estrutura de autonomia, mas existem pontos de dependência financeira e retorno que devem ser resolvidos antes do embarque.',
        )
        assessmentRec.set('answers', {
          canReturnTomorrow: 'yes_dependent',
          hasValidPassport: true,
          hasDigitalCopies: false,
          hasRequiredVisas: true,
          hasPhysicalControlOfPassport: true,
          hasReturnTicket: false,
          hasOwnMoney: false,
          hasInternationalCard: true,
          hasEmergencyReserve: false,
          whoPaysTrip: 'other_person',
          whoPaysHousing: 'other_person',
          hasWorkingPhone: true,
          hasInternetEsim: false,
          canBuyEssentialsAlone: true,
          canLeaveHousingAlone: true,
          canStayElsewhereIfNecessary: false,
          relationshipDuration: '1_to_6_months',
          inPersonMeetingsCount: '1_to_2_times',
          hasVisitedCountryBefore: false,
          knowsHostPersonally: 'partially',
          exactAddressKnown: true,
          respectsLimits: 'sometimes',
          minimizesConcerns: 'sometimes',
          feelsPressureToAcceptConditions: true,
          feltNeedToChooseBetweenSafetyAndTrip: false,
          familyFriendsInformedDetailed: true,
        })
        assessmentRec.set('breakdown', {
          documentation: 85,
          return: 25,
          finances: 30,
          communication: 60,
          housing: 75,
          mobility: 70,
          protectionNetwork: 65,
          emergency: 60,
        })
        assessmentRec.set('dependence_factors', [
          'Ausência de passagem de volta emitida no seu próprio nome.',
          'Você depende de outra pessoa para conseguir retornar ao seu país caso precise.',
          'Dependência financeira total de terceiros para custos diários no exterior.',
        ])
        assessmentRec.set('recommendations', [
          'Garanta uma passagem de volta com data marcada e código de reserva acessível.',
          'Tenha reserva financeira suficiente para emitir um bilhete aéreo por conta própria.',
          'Tenha uma reserva de emergência em conta acessível do exterior.',
        ])
        app.save(assessmentRec)

        // Seed Guardians
        const guardiansCol = app.findCollectionByNameOrId('guardians')
        const g1 = new Record(guardiansCol)
        g1.set('user_id', travelerId)
        g1.set('trip_id', tripRecordId)
        g1.set('name', 'Mariana Silva')
        g1.set('relationship', 'Irmã')
        g1.set('phone', '+55 11 98765-4321')
        g1.set('email', 'mariana.silva@email.com')
        g1.set('country', 'Brasil')
        g1.set('access_type', 'emergency')
        g1.set('notify_on_checkin', true)
        g1.set('receive_missed_alert', true)
        g1.set('receive_full_itinerary', true)
        g1.set('notes', 'Possui cópia das minhas fotos de passaporte e chave de segurança.')
        app.save(g1)

        const g2 = new Record(guardiansCol)
        g2.set('user_id', travelerId)
        g2.set('trip_id', tripRecordId)
        g2.set('name', 'Lucas Mendes')
        g2.set('relationship', 'Melhor amigo')
        g2.set('phone', '+55 11 91234-5678')
        g2.set('email', 'lucas.mendes@email.com')
        g2.set('country', 'Brasil')
        g2.set('access_type', 'security')
        g2.set('notify_on_checkin', false)
        g2.set('receive_missed_alert', true)
        g2.set('receive_full_itinerary', false)
        g2.set(
          'notes',
          'Avisar caso eu passe mais de 12 horas sem responder ao check-in programado.',
        )
        app.save(g2)

        // Seed Checkin
        const checkinsCol = app.findCollectionByNameOrId('checkins')
        const chk1 = new Record(checkinsCol)
        chk1.set('user_id', travelerId)
        chk1.set('trip_id', tripRecordId)
        chk1.set('status', 'ok')
        chk1.set('note', 'Check-in realizado com sucesso às 21:04. Tudo tranquilo no hotel.')
        chk1.set('location_approx', 'Roma, Itália')
        chk1.set('timestamp', new Date(Date.now() - 86400000).toISOString())
        app.save(chk1)
      }
    }
  },
  (app) => {
    // rollback seed if necessary
  },
)
