import { ChecklistItem, TripDestination } from '../types/trip'

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
      'Facilidade de compra imediata de passagens de trem/ônibus ou passagens aéreas emergenciais.',
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
    ],
    travelTips: [
      'Seguro viagem nos EUA é indispensável devido aos altíssimos custos de saúde privada.',
      'O 911 funciona de qualquer telefone celular ativo sem necessidade de crédito.',
    ],
  },
}

export interface SecurityLibraryCategory {
  id: string
  title: string
  iconName: string
  urgencyLevel: 'alta' | 'critica' | 'moderada'
  shortSummary: string
  immediateSteps: string[]
  whatNotToDo: string[]
  rightsAndResources: string[]
}

export const SECURITY_LIBRARY: SecurityLibraryCategory[] = [
  {
    id: 'retencao-passaporte',
    title: 'Retenção de passaporte por outra pessoa',
    iconName: 'FileLock',
    urgencyLevel: 'critica',
    shortSummary:
      'Ninguém tem o direito legal de confiscar seu passaporte ou documento de identidade no exterior.',
    immediateSteps: [
      'Vá com calma até um local público e seguro (hotel com recepção 24h, aeroporto, delegacia de polícia).',
      'Não confronte fisicamente a pessoa caso sinta risco à sua integridade física.',
      'Ligue para a polícia local (112 na Europa, 911 nos EUA) e relate que seu documento de viagem foi retido.',
      'Entre em contato imediatamente com o Plantão Consular do Brasil no país para emissão de documento emergencial (ARB).',
      'Acione seu Guardian de segurança através do aplicativo.',
    ],
    whatNotToDo: [
      'Não tente recuperar à força caso haja risco de agressão.',
      'Não assine nenhum documento de renúncia de direitos ou termo em língua estrangeira que não compreenda.',
    ],
    rightsAndResources: [
      'O passaporte é propriedade do governo emissor cedido ao cidadão; reter documento de terceiro configura crime na maioria dos países.',
      'Os consulados brasileiros prestam auxílio imediato para emissão de Autorização de Retorno ao Brasil.',
    ],
  },
  {
    id: 'perda-documentos',
    title: 'Perda ou furto de documentos no exterior',
    iconName: 'FileQuestion',
    urgencyLevel: 'moderada',
    shortSummary: 'Passo a passo rápido para registrar boletim e obter retorno seguro ao Brasil.',
    immediateSteps: [
      'Procure a delegacia de polícia local mais próxima (ou polícia de turismo) e registre a ocorrência policial (Police Report / Denuncia).',
      'Acesse as cópias digitais salvas no aplicativo ou e-mail seguro.',
      'Contate o Consulado Brasileiro mais próximo informando a data do seu voo de retorno.',
      'Solicite a emissão do Passaporte de Emergência ou Autorização de Retorno ao Brasil (ARB).',
    ],
    whatNotToDo: [
      'Não deixe para ir ao consulado poucas horas antes do voo sem antes contatar o plantão.',
    ],
    rightsAndResources: [
      'A ARB é emitida gratuitamente ou com taxa reduzida para permitir o retorno direto ao país de origem.',
    ],
  },
  {
    id: 'impedido-de-sair',
    title: 'Impedido(a) de sair da hospedagem ou trancado(a)',
    iconName: 'DoorClosed',
    urgencyLevel: 'critica',
    shortSummary:
      'Privação de liberdade é crime grave. Sua prioridade máxima é comunicação de emergência e segurança pessoal.',
    immediateSteps: [
      'Ligue imediatamente para o número de emergência da polícia local (112, 911).',
      'Ative o Emergency Mode no aplicativo para enviar sua localização e alerta aos seus Guardians.',
      'Se não puder falar, envie mensagem de texto ao Guardian com seu endereço exato e palavra-chave.',
      'Permaneça perto de janelas ou acessos visíveis se for seguro chamar atenção de vizinhos ou transeuntes.',
      'Mantenha seu celular carregado e desligue sons de notificação caso precise de discrição.',
    ],
    whatNotToDo: ['Não anuncie suas intenções caso a outra pessoa esteja alterada ou armada.'],
    rightsAndResources: [
      'Polícias locais tratam cárcere e restrição de liberdade com intervenção prioritária imediata.',
    ],
  },
  {
    id: 'sem-dinheiro',
    title: 'Fiquei sem dinheiro ou acesso a fundos',
    iconName: 'CreditCardOff',
    urgencyLevel: 'alta',
    shortSummary: 'Recursos imediatos para garantir alimentação, abrigo e emissão de passagem.',
    immediateSteps: [
      'Contate seu Guardian ou familiares de confiança para envio de remessa emergencial via Western Union, Wise ou Pix internacional.',
      'Se não tiver hospedagem, dirija-se a um aeroporto internacional ou estação central com funcionamento 24h e segurança.',
      'Contate o serviço consular brasileiro que pode orientar canais de apoio humanitário e contato com familiares.',
      'Use redes de acolhimento internacionais e albergues municipais de emergência.',
    ],
    whatNotToDo: [
      'Não aceite ofertas de desconhecidos que condicionem hospedagem ou dinheiro a trabalho forçado ou favores.',
    ],
    rightsAndResources: [
      'Serviços como Western Union permitem retirada de dinheiro em espécie na boca do caixa com documento de identidade em minutos.',
    ],
  },
  {
    id: 'perda-celular',
    title: 'Perda ou roubo do celular no exterior',
    iconName: 'SmartphoneOff',
    urgencyLevel: 'alta',
    shortSummary: 'Como recuperar acesso às comunicações e proteger seus dados.',
    immediateSteps: [
      'Acesse um computador público seguro ou aparelho de um hotel/aeroporto e bloqueie o aparelho via iCloud / Google Find My.',
      'Compre um chip local pré-pago barato ou use WhatsApp Web em dispositivo seguro para avisar seus contatos de confiança.',
      'Notifique seus Guardians de que você está temporariamente com novo número.',
      'Troque as senhas de seus bancos e e-mails principais.',
    ],
    whatNotToDo: [
      'Não deixe de avisar seus contatos de emergência para que não pensem que você desapareceu.',
    ],
    rightsAndResources: [
      'Muitos consulados possuem terminais e telefones para contato de emergência com familiares.',
    ],
  },
  {
    id: 'ameaca',
    title: 'Ameaças verbais, chantagem ou intimidação',
    iconName: 'ShieldAlert',
    urgencyLevel: 'critica',
    shortSummary: 'Como agir quando a convivência se torna ameaçadora ou controladora.',
    immediateSteps: [
      'Priorize sair do mesmo ambiente físico com calma e sem confronto direto.',
      'Vá para um café, lobby de hotel de grande rede ou posto de transporte público.',
      'Documente e salve prints, áudios ou anotações das ameaças em sua nuvem segura.',
      'Acione seu Guardian de nível de emergência e passe sua posição em tempo real.',
      'Se houver risco de violência física iminente, contate a polícia local.',
    ],
    whatNotToDo: [
      'Não responda com ameaças recíprocas que possam escalar o conflito.',
      'Não ceda a chantagens financeiras ou emocionais isoladamente.',
    ],
    rightsAndResources: [
      'Você tem o direito inalienável de encerrar a viagem e voltar a qualquer momento.',
    ],
  },
  {
    id: 'agressao',
    title: 'Agressão física ou violência',
    iconName: 'HeartCrack',
    urgencyLevel: 'critica',
    shortSummary: 'Atendimento médico imediato, proteção policial e suporte consular.',
    immediateSteps: [
      'Afaste-se imediatamente do agressor e busque socorro de terceiros ou de autoridades.',
      'Ligue para a emergência médica e policial (112 / 911).',
      'Procure o Pronto Socorro (Hospital) mais próximo para atendimento médico e relatório de lesões.',
      'Acione o Plantão Consular brasileiro para acompanhamento institucional.',
      'Ative o Emergency Mode no app.',
    ],
    whatNotToDo: ['Não retorne ao local compartilhado desacompanhado(a) da polícia.'],
    rightsAndResources: [
      'Vítimas de violência possuem canais de atendimento especializado e abrigo temporário em capitais europeias e norte-americanas.',
    ],
  },
  {
    id: 'perseguicao',
    title: 'Suspeita de perseguição ou vigilância',
    iconName: 'EyeOff',
    urgencyLevel: 'alta',
    shortSummary: 'Como despistar e buscar proteção em locais monitorados e movimentados.',
    immediateSteps: [
      'Entre imediatamente em um estabelecimento comercial movimentado (shopping, supermercado, hotel conceituado).',
      'Comunique a segurança privada do local sobre a pessoa que está te seguindo.',
      'Não vá para um beco escuro ou para o seu local de hospedagem se estiver sendo seguido(a).',
      'Peça um táxi ou transporte oficial de dentro do estabelecimento fechado.',
      'Se necessário, solicite que o gerente ou segurança chame a viatura policial.',
    ],
    whatNotToDo: ['Não tente confrontar a pessoa em locais ermos.'],
    rightsAndResources: [
      'Grandes estações e centros urbanos possuem monitoramento por câmeras de segurança integradas às forças policiais.',
    ],
  },
  {
    id: 'nao-sei-onde-estou',
    title: 'Perdido(a) ou sem localização conhecida',
    iconName: 'Compass',
    urgencyLevel: 'moderada',
    shortSummary: 'Como recuperar sua orientação e compartilhar coordenadas precisas.',
    immediateSteps: [
      'Abra o mapa do celular ou conecte-se a um Wi-Fi público e compartilhe seu PIN de localização via WhatsApp/app com seu Guardian.',
      'Identifique o nome da rua mais próxima e número de edificação ou placa comercial.',
      'Dirija-se a uma farmácia, posto de combustível ou estação de metrô.',
      'Se a bateria estiver fraca, anote o endereço em um pedaço de papel.',
    ],
    whatNotToDo: ['Não continue caminhando a esmo para bairros desconhecidos sem iluminação.'],
    rightsAndResources: [
      'A maioria dos aplicativos de transporte permite solicitar corrida com o GPS do ponto atual.',
    ],
  },
  {
    id: 'suspeita-exploracao',
    title: 'Suspeita de exploração ou promessa de emprego falsa',
    iconName: 'AlertTriangle',
    urgencyLevel: 'critica',
    shortSummary:
      'Identificação de armadilhas de trabalho irregular, retenção salarial ou tráfico velado.',
    immediateSteps: [
      'Não entregue seus documentos a empregadores informais ou intermediários sob pretexto algum.',
      'Recuse propostas com cobrança de taxas de hospedagem que criem dívidas impagáveis.',
      'Contate a Embaixada/Consulado do Brasil e linhas nacionais de apoio a trabalhadores migrantes.',
      'Organize seu plano de retorno ao país de origem com sua rede de segurança.',
    ],
    whatNotToDo: [
      'Não confie em promessas verbais que contradigam o contrato oficial ou a lei do país.',
    ],
    rightsAndResources: [
      'Linhas telefônicas gratuitas internacionais atendem anonimamente denúncias de exploração de trabalhadores.',
    ],
  },
  {
    id: 'preciso-sair-imediatamente',
    title: 'Preciso sair imediatamente e voltar para o Brasil',
    iconName: 'PlaneTakeoff',
    urgencyLevel: 'critica',
    shortSummary: 'Protocolo de saída emergencial e retorno seguro para casa.',
    immediateSteps: [
      'Pegue seus itens essenciais prioritários: Passaporte, celular, cartões/dinheiro e medicação de uso contínuo.',
      'Dirija-se diretamente ao aeroporto internacional ou estação central de transporte.',
      'No aeroporto, vá ao balcão da companhia aérea ou use seu cartão internacional para emitir o primeiro voo disponível com destino ao Brasil.',
      'Avise seu Guardian de que você está em trânsito no aeroporto e aguardando embarque.',
      'Se faltarem fundos ou documentos, procure o posto policial do aeroporto ou contate o plantão consular.',
    ],
    whatNotToDo: [
      'Não perca tempo tentando carregar malas pesadas se isso colocar sua saída em risco.',
      'Não hesite em deixar pertences materiais para trás quando a sua segurança e autonomia estiverem em jogo.',
    ],
    rightsAndResources: [
      'Aeroportos internacionais são zonas controladas de alta segurança com presença policial permanente 24h.',
    ],
  },
]
