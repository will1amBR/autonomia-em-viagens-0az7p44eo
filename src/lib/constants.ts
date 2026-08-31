import { ChecklistItem, TripDestination, DestinationSupportContacts } from '../types/trip'

export const DEFAULT_CHECKLIST: ChecklistItem[] = [
  {
    id: 'passaporte-valido',
    title: 'Passaporte válido por mais de 6 meses',
    description: 'Verifique a data de expiração e se há páginas livres para carimbos.',
    category: 'documentacao',
    completed: true,
    whyItMatters:
      'Sem passaporte válido você não pode embarcar nem retornar em caso de emergência.',
    actionTip:
      'Mantenha o passaporte sempre sob sua posse física, nunca o entregue a terceiros além de agentes oficiais de imigração.',
    isRequiredForHighAutonomy: true,
  },
  {
    id: 'copias-digitais',
    title: 'Cópias digitais em nuvem segura e com contato de confiança',
    description: 'Fotos ou PDFs nítidos do passaporte, vistos, apólice e RG.',
    category: 'documentacao',
    completed: false,
    whyItMatters:
      'Permite emissão emergencial de Passaporte de Emergência (ARB) no Consulado em caso de perda ou furto.',
    actionTip: 'Suba para um e-mail secundário e envie uma cópia para seu Guardian principal.',
    isRequiredForHighAutonomy: true,
  },
  {
    id: 'passagem-retorno',
    title: 'Passagem de retorno emitida com código localizador acessível',
    description: 'Bilhete aéreo de volta com data marcada e reserva confirmada.',
    category: 'retorno',
    completed: false,
    whyItMatters:
      'Garante o direito e a viabilidade técnica de voltar sem depender de terceiros para pagar ou autorizar.',
    actionTip: 'Guarde o e-ticket impresso ou salvo offline no aplicativo da companhia aérea.',
    isRequiredForHighAutonomy: true,
  },
  {
    id: 'seguro-viagem',
    title: 'Seguro viagem internacional com cobertura médica e repatriação',
    description: 'Apólice com cobertura mínima de EUR 30.000 (Schengen) ou USD 50.000.',
    category: 'seguranca',
    completed: false,
    whyItMatters:
      'Despesas hospitalares no exterior podem custar dezenas de milhares de dólares e criar dívidas impeditivas.',
    actionTip: 'Salve o número 0800/WhatsApp de atendimento 24h da seguradora nos seus favoritos.',
    isRequiredForHighAutonomy: true,
  },
  {
    id: 'dinheiro-proprio',
    title: 'Dinheiro próprio na moeda local ou em espécie de segurança',
    description: 'Valor equivalente a pelo menos 3 a 5 dias de estadia básica e alimentação.',
    category: 'financeiro',
    completed: false,
    whyItMatters:
      'Permite que você compre comida, água, táxi ou uma noite de hotel sem precisar pedir permissão.',
    actionTip:
      'Divida o valor em dois locais seguros distintos (uma parte na carteira, outra guardada na bagagem).',
    isRequiredForHighAutonomy: true,
  },
  {
    id: 'cartao-internacional',
    title: 'Cartão internacional habilitado (Wise, Nomad, C6 ou bancário)',
    description: 'Cartão físico com saldo e aplicativo com acesso autenticado no seu celular.',
    category: 'financeiro',
    completed: true,
    whyItMatters:
      'Facilidade de compra imediata de passagens de trem/ônibus ou passagens aéreas emergências.',
    actionTip:
      'Cadastre no Apple Pay / Google Wallet e garanta que você sabe as senhas de 4 dígitos do chip.',
    isRequiredForHighAutonomy: true,
  },
  {
    id: 'comunicacao-esim',
    title: 'Internet e roaming internacional / eSIM funcionando',
    description: 'Chip internacional ou eSIM ativado antes do desembarque.',
    category: 'comunicacao',
    completed: false,
    whyItMatters:
      'Ficar incomunicável no aeroporto ou na cidade aumenta drasticamente sua dependência de terceiros.',
    actionTip: 'Instale o app de eSIM (Airalo, Nomad, etc) e ative a linha antes de decolar.',
    isRequiredForHighAutonomy: true,
  },
  {
    id: 'endereco-hospedagem',
    title: 'Endereço completo da hospedagem anotado offline',
    description: 'Nome do local, rua, número, bairro, código postal e telefone da recepção.',
    category: 'destino',
    completed: true,
    whyItMatters:
      'Exigido pela imigração e indispensável caso você precise pegar um táxi sozinho(a).',
    actionTip:
      'Faça um screenshot do mapa da região em seu celular para navegação offline no Google Maps.',
    isRequiredForHighAutonomy: false,
  },
  {
    id: 'guardian-cadastrado',
    title: 'Pelo menos 1 Guardian de segurança ativo na plataforma',
    description: 'Pessoa de total confiança que receberá seus check-ins e avisos.',
    category: 'seguranca',
    completed: true,
    whyItMatters: 'Garante que alguém sabe onde você está e agirá caso você fique sem comunicação.',
    actionTip:
      'Explique ao seu Guardian o que é a plataforma e combine a frequência dos check-ins diários.',
    isRequiredForHighAutonomy: true,
  },
  {
    id: 'familia-informada',
    title: 'Família ou amigos próximos cientes do itinerário completo',
    description: 'Datas de voos, escalas, cidades onde ficará e contatos de quem estará com você.',
    category: 'seguranca',
    completed: false,
    whyItMatters: 'Evita isolamento comunicativo e fortalece sua rede de proteção primária.',
    actionTip: 'Envie um resumo em mensagem de texto para mais de uma pessoa.',
    isRequiredForHighAutonomy: true,
  },
  {
    id: 'consulado-embaixada',
    title: 'Contato da Embaixada/Consulado do Brasil no destino salvo',
    description: 'Telefone do plantão consular de emergência 24h para brasileiros.',
    category: 'destino',
    completed: false,
    whyItMatters:
      'O consulado auxilia em perda de passaporte, prisão indevida, acidentes e apoio a cidadãos.',
    actionTip: 'Grave o telefone de plantão no WhatsApp e na agenda telefônica local.',
    isRequiredForHighAutonomy: false,
  },
  {
    id: 'numeros-emergencia-local',
    title: 'Números de emergência da polícia e ambulância do país',
    description: 'Exemplo: 112 na Europa, 911 nos EUA, 999 no Reino Unido.',
    category: 'destino',
    completed: true,
    whyItMatters: 'Em situação de risco imediato, cada segundo conta.',
    actionTip:
      'Em quase todos os países, chamadas para 112 ou 911 funcionam mesmo sem saldo ou chip.',
    isRequiredForHighAutonomy: false,
  },
  {
    id: 'plano-de-saida',
    title: 'Plano de saída independente mapeado',
    description:
      'Saber como chegar ao aeroporto/estação de trem e ter 1 hotel alternativo mapeado.',
    category: 'retorno',
    completed: false,
    whyItMatters:
      'Se o ambiente ficar desconfortável ou tenso, você pode se retirar sem pedir ajuda ao anfitrião.',
    actionTip:
      'Tenha o app do Uber, Bolt ou FreeNow configurado com cartão internacional funcionando.',
    isRequiredForHighAutonomy: true,
  },
]

export const COUNTRY_EMERGENCY_CONTACTS: Record<string, DestinationSupportContacts> = {
  Italia: {
    country: 'Itália',
    city: 'Roma',
    policeNumber: '112 / 113',
    medicalEmergencyNumber: '118',
    generalEmergencyNumber: '112 (Número Único Europeu)',
    consulateEmbassyName: 'Consulado-Geral do Brasil em Roma / Embaixada',
    consulateAddress: 'Piazza Navona, 14 - 00186 Roma',
    consulatePhone: '+39 06 6889 661',
    consulateEmail: 'consular.roma@itamaraty.gov.br',
    consulateEmergency24h: '+39 333 306 4545 (Plantão Consular 24h)',
    referenceHospital: 'Ospedale Policlinico Umberto I (Viale del Policlinico, 155 - Roma)',
    womenHelpline: '1522 (Linha Nacional Antiviolência e Stalking — Gratuita e 24h)',
    foreignerNote:
      'Se você é cidadão de outro país, contate a embaixada ou consulado do seu país de nacionalidade.',
  },
  Franca: {
    country: 'França',
    city: 'Paris',
    policeNumber: '17 / 112',
    medicalEmergencyNumber: '15 (SAMU)',
    generalEmergencyNumber: '112',
    consulateEmbassyName: 'Consulado-Geral do Brasil em Paris',
    consulateAddress: '65 Avenue Franklin Delano Roosevelt, 75008 Paris',
    consulatePhone: '+33 1 45 61 63 00',
    consulateEmail: 'cg.paris@itamaraty.gov.br',
    consulateEmergency24h: '+33 6 80 12 32 34 (Plantão Consular 24h)',
    referenceHospital:
      "Hôpital Hôtel-Dieu de Paris / Hôpital Pitié-Salpêtrière (47-83 Bd de l'Hôpital)",
    womenHelpline: '3919 (Violences Femmes Info — Gratuito, anônimo e confidencial)',
    foreignerNote:
      'Se você é cidadão de outro país, contate a embaixada ou consulado do seu país de nacionalidade.',
  },
  Portugal: {
    country: 'Portugal',
    city: 'Lisboa',
    policeNumber: '112 (PSP / GNR)',
    medicalEmergencyNumber: '112 (INEM) / 808 24 24 24 (SNS 24)',
    generalEmergencyNumber: '112',
    consulateEmbassyName: 'Consulado-Geral do Brasil em Lisboa / Embaixada',
    consulateAddress: 'Praça Luís de Camões, 22, 1200-243 Lisboa',
    consulatePhone: '+351 21 321 4100',
    consulateEmail: 'cg.lisboa@itamaraty.gov.br',
    consulateEmergency24h: '+351 96 252 0581 (Plantão Consular 24h)',
    referenceHospital: 'Hospital de Santa Maria - CHULN (Av. Prof. Egas Moniz, Lisboa)',
    womenHelpline:
      '800 202 148 (Linha de Apoio a Vítimas de Violência Doméstica - CIG) e 144 (Emergência Social)',
    foreignerNote:
      'Se você é cidadão de outro país, contate a embaixada ou consulado do seu país de nacionalidade.',
  },
  Espanha: {
    country: 'Espanha',
    city: 'Madri',
    policeNumber: '112 / 091 (Policía Nacional) / 092 (Municipal)',
    medicalEmergencyNumber: '112 / 061 (SAMUR)',
    generalEmergencyNumber: '112',
    consulateEmbassyName: 'Consulado-Geral do Brasil em Madri / Embaixada',
    consulateAddress: 'Calle de Fernando el Santo, 6, 28010 Madrid',
    consulatePhone: '+34 91 700 4650',
    consulateEmail: 'cg.madri@itamaraty.gov.br',
    consulateEmergency24h: '+34 677 547 004 (Plantão Madri) / +34 659 078 057 (Barcelona)',
    referenceHospital: 'Hospital Universitario La Paz (P.º de la Castellana, 261, 28046 Madrid)',
    womenHelpline:
      '016 (Atendimento a vítimas de violência contra a mulher — não aparece na fatura telefônica)',
    foreignerNote:
      'Se você é cidadão de outro país, contate a embaixada ou consulado do seu país de nacionalidade.',
  },
  ReinoUnido: {
    country: 'Reino Unido',
    city: 'Londres',
    policeNumber: '999 (Emergência) / 101 (Não-emergência)',
    medicalEmergencyNumber: '999 (Ambulância) / 111 (Triagem NHS)',
    generalEmergencyNumber: '999 ou 112',
    consulateEmbassyName: 'Consulado-Geral do Brasil em Londres / Embaixada',
    consulateAddress: '14-16 Cockspur Street, London SW1Y 5BL',
    consulatePhone: '+44 20 7747 4500',
    consulateEmail: 'cg.londres@itamaraty.gov.br',
    consulateEmergency24h: '+44 77 2021 4422 (Plantão Consular 24h)',
    referenceHospital: "St Thomas' Hospital (Westminster Bridge Rd, London SE1 7EH)",
    womenHelpline: '0808 2000 247 (National Domestic Abuse Helpline / Refuge — 24h gratuita)',
    foreignerNote:
      'Se você é cidadão de outro país, contate a embaixada ou consulado do seu país de nacionalidade.',
  },
  EstadosUnidos: {
    country: 'Estados Unidos',
    city: 'Nova York / Washington',
    policeNumber: '911',
    medicalEmergencyNumber: '911',
    generalEmergencyNumber: '911',
    consulateEmbassyName: 'Consulado-Geral do Brasil em Nova York / Washington',
    consulateAddress: '225 E 41st St, New York, NY 10017',
    consulatePhone: '+1 917 777 7777',
    consulateEmail: 'cg.novayork@itamaraty.gov.br',
    consulateEmergency24h: '+1 646 405 3352 (Plantão Consular 24h NY)',
    referenceHospital: 'Bellevue Hospital Center (462 1st Avenue, New York, NY 10016)',
    womenHelpline:
      '1-800-799-SAFE (7233) — National Domestic Violence Hotline (ou envie "START" para 88788)',
    foreignerNote:
      'Se você é cidadão de outro país, contate a embaixada ou consulado do seu país de nacionalidade.',
  },
  Argentina: {
    country: 'Argentina',
    city: 'Buenos Aires',
    policeNumber: '911 (Policía de la Ciudad) / 101',
    medicalEmergencyNumber: '107 (SAME Ambulância pública)',
    generalEmergencyNumber: '911',
    consulateEmbassyName: 'Consulado-Geral do Brasil em Buenos Aires / Embaixada',
    consulateAddress: 'Av. Carlos Pellegrini, 1363, C1011AAA Buenos Aires',
    consulatePhone: '+54 11 4515 2400',
    consulateEmail: 'consular.baires@itamaraty.gov.br',
    consulateEmergency24h: '+54 9 11 4199 9668 (Plantão Consular 24h)',
    referenceHospital:
      'Hospital General de Agudos Dr. Juan A. Fernández (Cerviño 3356, Buenos Aires)',
    womenHelpline:
      '144 (Linha Nacional de Orientação a Mulheres em Situação de Violência — 24h gratuita)',
    foreignerNote:
      'Se você é cidadão de outro país, contate a embaixada ou consulado do seu país de nacionalidade.',
  },
  Japao: {
    country: 'Japão',
    city: 'Tóquio',
    policeNumber: '110 (Polícia)',
    medicalEmergencyNumber: '119 (Ambulância e Bombeiros)',
    generalEmergencyNumber: '110 (Polícia) / 119 (Ambulância)',
    consulateEmbassyName: 'Embaixada e Consulado-Geral do Brasil em Tóquio',
    consulateAddress: '2-11-12 Kita-Aoyama, Minato-ku, Tokyo 107-8633',
    consulatePhone: '+81 3 3404 5211',
    consulateEmail: 'consular.toquio@itamaraty.gov.br',
    consulateEmergency24h: '+81 90 1445 5473 (Plantão Consular Tóquio) / +81 90 2136 0888 (Nagoia)',
    referenceHospital:
      "St. Luke's International Hospital - Seiroka (9-1 Akashicho, Chuo City, Tokyo)",
    womenHelpline:
      '0120-279-338 (Linha de Apoio a Estrangeiros no Japão - Yorisoi Hotline com atendimento em português)',
    foreignerNote:
      'Se você é cidadão de outro país, contate a embaixada ou consulado do seu país de nacionalidade.',
  },
  Alemanha: {
    country: 'Alemanha',
    city: 'Berlim',
    policeNumber: '110',
    medicalEmergencyNumber: '112',
    generalEmergencyNumber: '112',
    consulateEmbassyName: 'Embaixada e Consulado-Geral do Brasil em Berlim',
    consulateAddress: 'Wallstraße 57, 10179 Berlin',
    consulatePhone: '+49 30 726 280',
    consulateEmail: 'consular.berlim@itamaraty.gov.br',
    consulateEmergency24h: '+49 170 870 9468 (Plantão Consular 24h Berlim)',
    referenceHospital: 'Charité - Universitätsmedizin Berlin (Campus Mitte, Charitéplatz 1)',
    womenHelpline:
      '116 016 (Hilfetelefon Gewalt gegen Frauen — gratuito 24h com suporte em português)',
    foreignerNote:
      'Se você é cidadão de outro país, contate a embaixada ou consulado do seu país de nacionalidade.',
  },
  Chile: {
    country: 'Chile',
    city: 'Santiago',
    policeNumber: '133 (Carabineros) / 134 (PDI)',
    medicalEmergencyNumber: '131 (SAMU)',
    generalEmergencyNumber: '133 / 131',
    consulateEmbassyName: 'Consulado-Geral do Brasil em Santiago',
    consulateAddress: 'Calle Los Militares 6191, Piso 1, Las Condes, Santiago',
    consulatePhone: '+56 2 2820 5800',
    consulateEmail: 'cg.santiago@itamaraty.gov.br',
    consulateEmergency24h: '+56 9 9334 5103 (Plantão Consular 24h Santiago)',
    referenceHospital:
      'Hospital de Urgencia Asistencia Pública - Posta Central (Curicó 345, Santiago)',
    womenHelpline: '1455 (SernamEG — Orientação e apoio a mulheres 24h gratuito)',
    foreignerNote:
      'Se você é cidadão de outro país, contate a embaixada ou consulado do seu país de nacionalidade.',
  },
  Irlanda: {
    country: 'Irlanda',
    city: 'Dublin',
    policeNumber: '999 / 112 (An Garda Síochána)',
    medicalEmergencyNumber: '999 / 112',
    generalEmergencyNumber: '112 ou 999',
    consulateEmbassyName: 'Embaixada e Setor Consular do Brasil em Dublin',
    consulateAddress: 'Block 8, Harcourt Centre, Charlotte Way, Dublin 2, D02 K580',
    consulatePhone: '+353 1 475 6000',
    consulateEmail: 'consular.dublin@itamaraty.gov.br',
    consulateEmergency24h: '+353 87 981 4403 (Plantão Consular 24h Dublin)',
    referenceHospital: "St. James's Hospital - Emergency Dept (James's Street, Dublin 8)",
    womenHelpline: "1800 341 900 (Women's Aid National Freephone Helpline 24h)",
    foreignerNote:
      'Se você é cidadão de outro país, contate a embaixada ou consulado do seu país de nacionalidade.',
  },
  Canada: {
    country: 'Canadá',
    city: 'Toronto / Ottawa',
    policeNumber: '911',
    medicalEmergencyNumber: '911',
    generalEmergencyNumber: '911',
    consulateEmbassyName: 'Consulado-Geral do Brasil em Toronto / Embaixada em Ottawa',
    consulateAddress: '77 Bloor St W, Suite 1109, Toronto, ON M5S 1M2',
    consulatePhone: '+1 416 922 2503',
    consulateEmail: 'cg.toronto@itamaraty.gov.br',
    consulateEmergency24h: '+1 437 239 8458 (Plantão Consular 24h Toronto)',
    referenceHospital: "St. Michael's Hospital (36 Queen St E, Toronto, ON M5B 1W8)",
    womenHelpline: '1-866-863-0511 (Assaulted Women’s Helpline 24h) ou disque #SAFE',
    foreignerNote:
      'Se você é cidadão de outro país, contate a embaixada ou consulado do seu país de nacionalidade.',
  },
  Mexico: {
    country: 'México',
    city: 'Cidade do México',
    policeNumber: '911',
    medicalEmergencyNumber: '911 / 065 (Cruz Roja)',
    generalEmergencyNumber: '911',
    consulateEmbassyName: 'Embaixada e Consulado do Brasil na Cidade do México',
    consulateAddress: 'Calle Fernando Alencastre 136, Lomas de Virreyes, CDMX 11000',
    consulatePhone: '+52 55 5201 4531',
    consulateEmail: 'consular.mexico@itamaraty.gov.br',
    consulateEmergency24h: '+52 1 55 4553 4980 (Plantão Consular 24h México)',
    referenceHospital:
      'Hospital General de México Dr. Eduardo Liceaga (Calle Dr. Balmis 148, CDMX)',
    womenHelpline: '*765 ou 55 5658 1111 (Línea Mujeres CDMX — 24h)',
    foreignerNote:
      'Se você é cidadão de outro país, contate a embaixada ou consulado do seu país de nacionalidade.',
  },
  Uruguai: {
    country: 'Uruguai',
    city: 'Montevidéu',
    policeNumber: '911',
    medicalEmergencyNumber: '105',
    generalEmergencyNumber: '911',
    consulateEmbassyName: 'Consulado-Geral do Brasil em Montevidéu',
    consulateAddress: 'Bulevar General Artigas 1256, 11300 Montevideo',
    consulatePhone: '+598 2707 2119',
    consulateEmail: 'cg.montevideu@itamaraty.gov.br',
    consulateEmergency24h: '+598 99 642 419 (Plantão Consular 24h Montevidéu)',
    referenceHospital: 'Hospital de Clínicas Dr. Manuel Quintela (Av. Italia s/n, Montevideo)',
    womenHelpline: '0800 4141 ou *4141 de qualquer celular (Apoio e orientação a mulheres 24h)',
    foreignerNote:
      'Se você é cidadão de outro país, contate a embaixada ou consulado do seu país de nacionalidade.',
  },
}

export const DESTINATIONS_CATALOG: Record<string, TripDestination> = {
  Italia: {
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
      'Aplicativos de transporte ativos: Uber, FreeNow e táxis autorizados com taxímetro (cor branca).',
    ],
  },
  Franca: {
    country: 'França',
    city: 'Paris',
    countryCode: 'FR',
    policeNumber: '17',
    medicalEmergencyNumber: '15 (SAMU)',
    generalEmergencyNumber: '112 (Europeu)',
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
        name: 'Gare du Nord - Posto de Polícia',
        type: 'Estação de Trem Principal',
        address: '18 Rue de Dunkerque, 75010 Paris',
        notes: 'Conexão para trens internacionais e regionais, posto policial 24h.',
      },
    ],
    travelTips: [
      'Documento de viagem válido é obrigatório para trânsito no espaço Schengen.',
      'Sempre compre bilhetes oficiais de transporte público; evite intermediários.',
    ],
  },
  Portugal: {
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
        name: 'Esquadra de Turismo da PSP dos Restauradores',
        type: 'Polícia de Segurança Pública / Atendimento a Turistas',
        address: 'Palácio Foz, Praça dos Restauradores, 1250-096 Lisboa',
        notes:
          'Posto especializado em acolhimento a turistas estrangeiros com suporte multilíngue.',
      },
    ],
    travelTips: [
      'A língua facilita a comunicação, mas mantenha suas reservas financeiras e documentos protegidos.',
      'Em caso de perda documental, o Consulado emite Autorização de Retorno ao Brasil (ARB).',
    ],
  },
  EstadosUnidos: {
    country: 'Estados Unidos',
    city: 'Miami / Orlando',
    countryCode: 'US',
    policeNumber: '911',
    medicalEmergencyNumber: '911',
    generalEmergencyNumber: '911',
    consulateEmbassyName: 'Consulado-Geral do Brasil em Miami',
    consulateAddress: '3150 SW 38th Ave, Suite 100, Miami, FL 33146',
    consulatePhone: '+1 305 285 6200',
    consulateEmail: 'consbras.miami@itamaraty.gov.br',
    consulateEmergency24h: '+1 305 342 0713 (Plantão Consular 24h)',
    safeHavens: [
      {
        name: 'Miami International Airport (MIA)',
        type: 'Aeroporto Internacional',
        address: '2100 NW 42nd Ave, Miami, FL 33142',
        notes: 'Área com segurança federal TSA e polícia do condado.',
      },
      {
        name: 'Jackson Memorial Hospital (Ryder Trauma Center)',
        type: 'Hospital de Trauma e Emergência',
        address: '1611 NW 12th Ave, Miami, FL 33136',
        notes: 'Centro de trauma e pronto-atendimento 24h.',
      },
    ],
    travelTips: [
      'Seguro viagem nos EUA é indispensável devido aos altíssimos custos de saúde privada.',
      'O 911 funciona de qualquer telefone celular ativo sem necessidade de crédito.',
    ],
  },
  Espanha: {
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
    consulateEmergency24h:
      '+34 677 547 004 (Plantão Consular 24h Madri) / +34 659 078 057 (Barcelona)',
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
    travelTips: [
      'O número de emergência 112 é gratuito e funciona mesmo sem sinal de operadora local.',
      'Mantenha sempre documento oficial de identificação consigo. Exija sempre a posse física do seu passaporte.',
      'Em caso de furto na Espanha, a denúncia pode ser feita na Delegacia de Turismo da Polícia Nacional.',
    ],
  },
  ReinoUnido: {
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
    travelTips: [
      'O Reino Unido exige passaporte válido durante toda a estadia (brasileiros a turismo não precisam de visto prévio por até 6 meses).',
      'O serviço de emergência 999 conecta diretamente polícia, ambulância e bombeiros.',
      'Em situações médicas urgentes que não sejam risco iminente de morte, ligue 111 para triagem pelo NHS.',
    ],
  },
  Argentina: {
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
      {
        name: 'Comisaría del Turista de la Ciudad de Buenos Aires',
        type: 'Polícia Especializada de Turismo',
        address: 'Av. Corrientes 436, C1043AAR Buenos Aires',
        notes: 'Atendimento prioritário a turistas estrangeiros com tradutores.',
      },
    ],
    travelTips: [
      'Brasileiros podem entrar na Argentina com RG recente em bom estado ou Passaporte válido.',
      'O serviço de ambulância pública SAME atende pelo 107 sem custos.',
      'Tenha sempre moeda local (pesos) ou cartão internacional aceito em caixas e estabelecimentos.',
    ],
  },
  Japao: {
    country: 'Japão',
    city: 'Tóquio',
    countryCode: 'JP',
    policeNumber: '110 (Polícia)',
    medicalEmergencyNumber: '119 (Ambulância e Bombeiros)',
    generalEmergencyNumber: '110 (Polícia) / 119 (Ambulância)',
    consulateEmbassyName: 'Embaixada do Brasil em Tóquio',
    consulateAddress: '2-11-12 Kita-Aoyama, Minato-ku, Tokyo 107-8633',
    consulatePhone: '+81 3 3404 5211',
    consulateEmail: 'consular.toquio@itamaraty.gov.br',
    consulateEmergency24h:
      '+81 90 1445 5473 (Plantão Consular 24h Tóquio) / +81 90 2136 0888 (Nagoia)',
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
      'Desde 2023, brasileiros titulares de passaporte comum eletrônico estão isentos de visto para estadias de até 90 dias a turismo.',
      'O número 110 atende a polícia e o 119 ambulâncias (em inglês e japonês).',
      'Mantenha sempre seu passaporte físico consigo; a lei japonesa exige porte obrigatório por estrangeiros.',
    ],
  },
  Alemanha: {
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
        name: 'Charité - Universitätsmedizin Berlin',
        type: 'Hospital Universitário / Pronto Socorro Central 24h',
        address: 'Charitéplatz 1, 10117 Berlin',
        notes: 'Centro de trauma e urgência com atendimento multilíngue 24h.',
      },
      {
        name: 'Berlin Hauptbahnhof (Estação Central)',
        type: 'Estação Central Ferroviária',
        address: 'Europaplatz 1, 10557 Berlin',
        notes: 'Posto policial permanente da Bundespolizei e serviço Bahnhofsmission 24h.',
      },
    ],
    travelTips: [
      'Linha de apoio a mulheres na Alemanha: 116 016 (gratuito, 24h e em português).',
      'Ligue 112 para emergência médica e 110 para a polícia em todo o país sem custo.',
    ],
  },
  Chile: {
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
        notes: 'Postos permanentes de Carabineros e PDI 24h.',
      },
      {
        name: 'Hospital de Urgencia Asistencia Pública (Posta Central)',
        type: 'Hospital Público de Urgência 24h',
        address: 'Curicó 345, Santiago Centro',
        notes: 'Principal pronto-socorro de trauma e emergência do centro de Santiago.',
      },
    ],
    travelTips: [
      'Linha de apoio a mulheres no Chile: 1455 (gratuito e 24h).',
      'PDI (Policía de Investigaciones) atende no número 134.',
    ],
  },
  Irlanda: {
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
        notes: 'Maior pronto-socorro público de Dublin com atendimento emergencial.',
      },
    ],
    travelTips: [
      'Linha Nacional de Apoio a Mulheres na Irlanda (Women’s Aid): 1800 341 900 (gratuito 24h).',
      'Número de emergência europeu 112 funciona gratuitamente de qualquer celular.',
    ],
  },
  Canada: {
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
        notes: 'Centro de trauma nível 1 no centro de Toronto.',
      },
    ],
    travelTips: [
      'Linha de Crise no Canadá (Assaulted Women’s Helpline): 1-866-863-0511 ou disque #SAFE.',
      'Disque 911 de qualquer aparelho celular ativo para atendimento imediato.',
    ],
  },
  Mexico: {
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
  Uruguai: {
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
      'Linha de apoio a mulheres no Uruguai: 0800 4141 ou *4141 de celular.',
      'Cidadãos brasileiros podem ingressar no Uruguai apenas com RG em bom estado ou passaporte.',
    ],
  },
}

export interface SecurityLibraryScenario {
  id: string
  title: string
  iconName: string
  urgencyLevel: 'alta' | 'critica' | 'moderada'
  shortSummary: string
  immediateSteps: string[] // Exatamente 5 passos práticos
  whatNotToDo: string[] // Exatamente 3 comportamentos de risco a evitar
  rightsAndResources: string[]
}

// Alias for backwards compatibility
export type SecurityLibraryCategory = SecurityLibraryScenario

// The EXACT 11 scenarios requested in the specification
export const SECURITY_LIBRARY: SecurityLibraryScenario[] = [
  {
    id: 'retencao-passaporte',
    title: '1. Retenção de passaporte/documentos',
    iconName: 'FileLock',
    urgencyLevel: 'critica',
    shortSummary:
      'Alguém pegou seus documentos e não devolve. Reter passaporte alheio é crime internacional.',
    immediateSteps: [
      'Mantenha a calma e dirija-se imediatamente a um local público seguro e movimentado (recepção de hotel 24h, aeroporto ou delegacia).',
      'Solicite a devolução de maneira firme e educada por escrito (mensagem de texto/WhatsApp), registrando a data e o horário da recusa.',
      'Ligue para o número de emergência policial local (112 na Europa, 911 nos EUA) informando que seu documento de viagem estrangeiro foi retido.',
      'Contate com urgência o Plantão Consular do Brasil para relatar a retenção e iniciar a emissão de documento de viagem emergencial (ARB).',
      'Acione seus Guardians no aplicativo informando sua localização exata e situação atual.',
    ],
    whatNotToDo: [
      'Não tente recuperar o documento através de confronto físico ou agressão verbal direta.',
      'Não assine nenhum documento de desistência, confissão de dívida inventada ou acordo sob pressão.',
      'Não permaneça sozinho(a) em local isolado com quem reteve seus documentos.',
    ],
    rightsAndResources: [
      'O passaporte é propriedade soberana do governo emissor cedido ao titular; sua retenção arbitrária por terceiros é ilegal em quase todas as jurisdições.',
      'Os consulados brasileiros prestam assistência direta e podem emitir a Autorização de Retorno ao Brasil (ARB) para embarque imediato.',
    ],
  },
  {
    id: 'impedido-de-sair',
    title: '2. Impedido(a) de sair do local',
    iconName: 'DoorClosed',
    urgencyLevel: 'critica',
    shortSummary:
      'Você não consegue deixar a hospedagem ou está trancado(a). A restrição de locomoção exige ação prioritária.',
    immediateSteps: [
      'Ligue discretamente para o serviço de emergência policial local (112, 911 ou 999) informando endereço exato e que está retido(a).',
      'Ative o Emergency Mode no aplicativo para enviar localização e alerta em tempo real para todos os seus Guardians.',
      'Se não puder falar, envie mensagem de texto ao seu Guardian principal com sua localização e código de socorro.',
      'Identifique saídas secundárias seguras, janelas acessíveis ou pontos onde seja possível pedir socorro a pedestres sem se colocar em risco.',
      'Mantenha a bateria do celular protegida em modo de economia e mantenha pertences essenciais no bolso.',
    ],
    whatNotToDo: [
      'Não anuncie previamente sua intenção de fuga ou de chamar a polícia se a outra pessoa demonstrar agressividade.',
      'Não tente saltos perigosos de locais altos ou manobras que causem risco de queda e fratura grave.',
      'Não aceite promessas de liberação condicionadas a entrega de dinheiro, senhas ou favores.',
    ],
    rightsAndResources: [
      'Cárcere privado e restrição arbitrária de liberdade são crimes de prioridade máxima para forças policiais em qualquer país.',
      'A polícia local tem prerrogativa legal de arrombamento técnico em situações de risco à vida ou integridade física.',
    ],
  },
  {
    id: 'sem-dinheiro',
    title: '3. Sem dinheiro próprio',
    iconName: 'CreditCardOff',
    urgencyLevel: 'alta',
    shortSummary:
      'Ficou sem acesso a recursos financeiros próprios. Recuperar autonomia monetária básica é o foco imediato.',
    immediateSteps: [
      'Contate imediatamente familiares ou Guardians de confiança solicitando remessa de emergência via Western Union, Wise, Nomad ou Pix internacional.',
      'Se não tiver como pagar acomodação, dirija-se a um local público seguro e aquecido 24 horas (aeroporto internacional ou terminal ferroviário central).',
      'Contate o serviço consular brasileiro para orientação sobre redes de acolhimento social, albergues municipais ou mediação com familiares no Brasil.',
      'Localize uma agência da Western Union ou banco conveniado onde seja possível retirar dinheiro em espécie apenas com documento de identificação.',
      'Consulte sua seguradora de viagem para verificar coberturas de adiantamento de fundos por perda/extravio de meios de pagamento.',
    ],
    whatNotToDo: [
      'Não aceite propostas de trabalho informal rápido de estranhos que condicionem abrigo a atividades suspeitas ou retenção de documentos.',
      'Não recorra a empréstimos informais com desconhecidos no destino.',
      'Não durma em praças públicas desprotegidas ou áreas ermas desprovidas de vigilância.',
    ],
    rightsAndResources: [
      'Serviços de remessa instantânea internacional permitem retirada em espécie na boca do caixa com código de transferência em minutos.',
      'Apoio consular auxilia na facilitação de repatriação com apoio da rede familiar no Brasil.',
    ],
  },
  {
    id: 'celular-cortado',
    title: '4. Celular/internet cortados',
    iconName: 'SmartphoneOff',
    urgencyLevel: 'alta',
    shortSummary:
      'Perdeu a comunicação com o exterior por falta de sinal, bateria ou bloqueio intencional.',
    immediateSteps: [
      "Procure um estabelecimento comercial com Wi-Fi público e seguro (Starbucks, McDonald's, lobby de grande hotel, biblioteca municipal ou aeroporto).",
      'Conecte-se e envie uma mensagem rápida aos seus Guardians avisando que você está seguro(a) mas temporariamente sem linha telefônica.',
      'Compre um chip local pré-pago físico barato (em bancas ou supermercados) ou ative um plano eSIM internacional de emergência.',
      'Grave números fundamentais de emergência, do Consulado e do seu Guardian à mão em um papel guardado no bolso.',
      'Se o aparelho foi retido ou danificado por terceiro, use terminais de computador públicos de hotéis para contatar sua rede de apoio.',
    ],
    whatNotToDo: [
      'Não deixe de comunicar seus contatos de emergência por mais de poucas horas, para evitar disparos falsos do protocolo de busca.',
      'Não insira senhas bancárias em computadores públicos abertos e desprotegidos sem autenticação em duas etapas.',
      'Não confie em redes Wi-Fi desconhecidas sem senha em áreas de risco.',
    ],
    rightsAndResources: [
      'Chamadas para números de emergência (112, 911, 999) funcionam em qualquer aparelho celular mesmo sem chip e sem saldo.',
      'Postos consulares e balcões de informação em aeroportos disponibilizam acesso a ligações de urgência para viajantes.',
    ],
  },
  {
    id: 'perda-documentos',
    title: '5. Perda ou roubo de documentos',
    iconName: 'FileQuestion',
    urgencyLevel: 'moderada',
    shortSummary:
      'Passaporte ou identidade foram perdidos ou furtados. Roteiro objetivo para emissão de documento emergencial.',
    immediateSteps: [
      'Procure a delegacia de polícia mais próxima (ou Comissaria de Turismo) e registre a ocorrência policial oficial (Police Report / Denúncia de furto).',
      'Acesse as cópias digitais salvas no SafeTrip, no seu e-mail ou na nuvem segura para comprovar sua identidade.',
      'Agende atendimento de urgência no Consulado Brasileiro mais próximo ou contate o Plantão Consular caso seu voo seja nas próximas 24-48 horas.',
      'Solicite a emissão do Passaporte de Emergência ou da Autorização de Retorno ao Brasil (ARB gratuita/tarifa reduzida).',
      'Avise a companhia aérea sobre o registro da ocorrência e informe os novos dados do documento de viagem.',
    ],
    whatNotToDo: [
      'Não espere o dia do embarque para procurar o Consulado sem aviso prévio ao plantão consular.',
      'Não pague intermediários não oficiais que prometem agilizar passaportes consulares fora dos canais legítimos do Itamaraty.',
      'Não viaje entre países sem antes regularizar o documento oficial de trânsito internacional.',
    ],
    rightsAndResources: [
      'A ARB (Autorização de Retorno ao Brasil) é um documento oficial garantido por lei consular para repatriar brasileiros de volta ao território nacional.',
      'A certidão ou boletim de ocorrência policial protege você contra uso fraudulento do seu documento perdido por criminosos.',
    ],
  },
  {
    id: 'agressao-ameaca',
    title: '6. Agressão física ou ameaça',
    iconName: 'HeartCrack',
    urgencyLevel: 'critica',
    shortSummary:
      'Sofreu violência física, tentativa de agressão ou ameaças graves contra sua integridade.',
    immediateSteps: [
      'Afaste-se imediatamente do agressor e busque abrigo em local com segurança profissional ou grande fluxo de pessoas.',
      'Ligue para a polícia (112, 911, 999) solicitando viatura urgente e informe se há necessidade de atendimento médico ambulatorial.',
      'Dirija-se ao pronto-socorro hospitalar de referência pública para realização de atendimento e laudo médico de lesões corporais.',
      'Acione o Plantão Consular do Brasil para acompanhamento institucional, lista de advogados credenciados e apoio psicológico/social.',
      'Ative o Emergency Mode no aplicativo para mobilizar sua rede de Guardians.',
    ],
    whatNotToDo: [
      'Não retorne ao local compartilhado desacompanhado(a) de escolta policial para buscar pertences.',
      'Não minimize o episódio de violência nem acredite em desculpas ou promessas de que não se repetirá.',
      'Não descarte roupas ou evidências físicas antes do exame médico/pericial hospitalar.',
    ],
    rightsAndResources: [
      'Quase todos os países contam com redes especializadas de proteção à mulher e acolhimento a vítimas de crimes violentos com abrigos anônimos.',
      'O Consulado brasileiro tem dever funcional de acompanhar casos de agressão a cidadãos nacionais no exterior.',
    ],
  },
  {
    id: 'isolamento-forcado',
    title: '7. Isolamento forçado',
    iconName: 'EyeOff',
    urgencyLevel: 'alta',
    shortSummary:
      'Está sendo impedido(a) de contatar amigos, familiares ou pessoas do exterior por terceiros.',
    immediateSteps: [
      'Aproveite qualquer ida ao banheiro, farmácia, supermercado ou saguão para enviar uma mensagem curta de alerta ao seu Guardian.',
      'Utilize o modo de navegação anônima no navegador para acessar serviços de e-mail e registrar sua situação.',
      'Combine previamente com seu Guardian palavras-código simples que indiquem que você precisa de contato sem levantar suspeitas.',
      'Dirija-se à farmácia ou posto de saúde local e peça ajuda reservada a um atendente ou profissional de saúde.',
      'Mapeie a estação de transporte ou posto policial mais próximo para saída autônoma na primeira oportunidade.',
    ],
    whatNotToDo: [
      'Não deixe mensagens de socorro abertas na tela ou no histórico visível do celular compartilhado.',
      'Não aceite que terceiros atendam suas ligações pessoais ou respondam por você perante familiares.',
      'Não se convença de que o isolamento é "para sua proteção" — o controle comunicativo é sinal clássico de vulnerabilização.',
    ],
    rightsAndResources: [
      'Nenhum anfitrião, empregador ou parceiro tem direito de restringir suas comunicações privadas com o exterior.',
      'Profissionais de saúde e farmácias na Europa e Américas são treinados para acolher relatos discretos de isolamento e acionar auxílio.',
    ],
  },
  {
    id: 'coacao-chantagem',
    title: '8. Coação emocional ou chantagem',
    iconName: 'ShieldAlert',
    urgencyLevel: 'alta',
    shortSummary:
      'Está sendo pressionado(a), manipulado(a) ou chantageado(a) com ameaças financeiras, morais ou jurídicas.',
    immediateSteps: [
      'Guarde cópias e prints de todas as conversas, áudios, cobranças e mensagens ameaçadoras em nuvem segura ou envie para seu Guardian.',
      'Lembre-se de que ameaças jurídicas infundadas (como "mandar te prender na imigração") são comumente falsas e usadas para criar medo.',
      'Consulte a assistência jurídica consular brasileira para entender a real legislação do país e seus direitos.',
      'Reúna seus itens vitais (documento, cartão, celular) e mude-se para uma hospedagem independente mapeada.',
      'Comunique aos seus Guardians o teor das chantagens para que eles não sejam enganados por terceiros no Brasil.',
    ],
    whatNotToDo: [
      'Não ceda a exigências financeiras extorsivas ou assinatura de confissões de dívida.',
      'Não responda com ofensas ou ameaças que possam ser tiradas de contexto pela outra pessoa.',
      'Não se isole nem guarde o sofrimento para si — compartilhe a verdade com sua rede de apoio.',
    ],
    rightsAndResources: [
      'Chantagem, extorsão e violência psicológica configuram infrações penais na maioria das legislações internacionais.',
      'Você tem o direito absoluto de romper qualquer compromisso de viagem e retornar para sua casa a qualquer instante.',
    ],
  },
  {
    id: 'hospedagem-insegura',
    title: '9. Hospedagem insegura ou inadequada',
    iconName: 'AlertTriangle',
    urgencyLevel: 'alta',
    shortSummary:
      'O local onde está acomodado(a) não oferece segurança, fechaduras adequadas ou viola sua privacidade.',
    immediateSteps: [
      'Pegue seus pertences essenciais imediatamente e retire-se com calma do local durante o dia ou em horário movimentado.',
      'Vá para o lobby de um hotel de rede conhecida ou café movimentado e faça a reserva de uma acomodação segura (hotel com recepção 24h).',
      'Se a reserva foi feita por plataforma (Airbnb, Booking), acione o suporte de segurança do app reportando acomodação insegura para reembolso/realocação.',
      'Atualize o novo endereço no SafeTrip e avise seus Guardians sobre a mudança de hospedagem.',
      'Se houver suspeita de câmeras ocultas ou fechaduras adulteradas, registre fotos como prova antes de sair.',
    ],
    whatNotToDo: [
      'Não permaneça em quarto sem tranca interna ou com terceiros não autorizados com acesso à chave.',
      'Não aceite quartos compartilhados improvisados que não estavam previstos no acordo original.',
      'Não economize na hospedagem às custas da sua integridade física ou psicológica básica.',
    ],
    rightsAndResources: [
      'Plataformas internacionais de hospedagem possuem protocolos de reassentamento de emergência 24h com custeio de novo hotel.',
      'O consumidor turista tem direito a rescisão contratual imediata diante de insalubridade ou insegurança.',
    ],
  },
  {
    id: 'problemas-imigracao',
    title: '10. Problemas com visto ou imigração',
    iconName: 'Compass',
    urgencyLevel: 'moderada',
    shortSummary:
      'Questões legais com prazo de permanência, documentação irregular no destino ou fiscalização de fronteira.',
    immediateSteps: [
      'Verifique a data limite real do seu carimbo de entrada ou autorização eletrônica de viagem (Schengen, ESTA, etc).',
      'Contate o setor de assistência a cidadãos do Consulado-Geral do Brasil para receber orientação jurídica consular precisa.',
      'Se for abordado(a) por autoridades policiais ou de imigração, mantenha postura calma, apresente seu passaporte e solicite falar com o Consulado.',
      'Não tente atravessar fronteiras terrestres clandestinamente ou sem controle migratório formal.',
      'Em caso de overstay (permanência acima do prazo), planeje a saída voluntária pelo aeroporto e consulte um advogado de imigração local.',
    ],
    whatNotToDo: [
      'Não apresente documentos falsos, vistos adulterados ou declarações inverídicas a oficiais de fronteira.',
      'Não assine termos em língua estrangeira que você não domine sem a presença de tradutor juramentado ou representante consular.',
      'Não fuja de postos de fiscalização oficial.',
    ],
    rightsAndResources: [
      'A Convenção de Viena sobre Relações Consulares assegura ao estrangeiro detido o direito inalienável de contatar seu Consulado de origem.',
      'A saída voluntária costuma implicar apenas sanção administrativa (multa), enquanto fraudes ativas geram consequências penais.',
    ],
  },
  {
    id: 'emergencia-saude',
    title: '11. Emergência de saúde',
    iconName: 'HeartCrack',
    urgencyLevel: 'critica',
    shortSummary:
      'Precisa de atendimento médico urgente, sofreu acidente ou apresenta sintomas graves de enfermidade.',
    immediateSteps: [
      'Ligue imediatamente para o número de emergência médica local (112 na Europa, 911 nos EUA/Argentina, 999 no Reino Unido, 119 no Japão).',
      'Acione a central de assistência 24h do seu Seguro Viagem internacional para autorização de cobertura e indicação de hospital credenciado.',
      'Dirija-se ao pronto-socorro do hospital público de referência mais próximo da sua localização.',
      'Tenha em mãos sua apólice de seguro, passaporte e histórico de alergias ou medicamentos de uso contínuo.',
      'Avise seu Guardian de Emergência para que ele possa acompanhar seu boletim médico e contatar o hospital se necessário.',
    ],
    whatNotToDo: [
      'Não hesite em chamar socorro médico por medo de custo financeiro — a vida e integridade são prioridade absoluta.',
      'Não tome medicações fortes desconhecidas oferecidas por leigos no exterior.',
      'Não saia do hospital sem o relatório médico de alta (Medical Report) detalhado com diagnósticos e receitas para reembolso do seguro.',
    ],
    rightsAndResources: [
      'Hospitais públicos na União Europeia e nas Américas têm obrigação legal de estabilização de urgência com risco de vida para qualquer pessoa.',
      'A maioria das apólices de seguro viagem inclui garantia de repatriação médica com acompanhante em caso de gravidade.',
    ],
  },
]
