// Mock data for testing without MongoDB
interface MockUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  university: string;
  course: string;
  age: number;
  gender: string;
  bio: string;
  interests: string[];
  lifestyle: {
    sleepSchedule: string;
    cleanliness: string;
    socialLevel: string;
    studyHabits: string;
  };
  location: {
    city: string;
    state: string;
    neighborhood: string;
  };
  budget: {
    min: number;
    max: number;
  };
  preferences: {
    ageRange: { min: number; max: number };
    genderPreference: string;
    lifestyle: {
      sleepSchedule: string[];
      cleanliness: string[];
      socialLevel: string[];
      studyHabits: string[];
    };
  };
  profilePicture: string;
  isActive: boolean;
  likedUsers: string[];
  dislikedUsers: string[];
  matchedUsers: string[];
  createdAt: Date;
  updatedAt: Date;
}

export const mockUsers: MockUser[] = [
  {
    _id: "507f1f77bcf86cd799439011",
    name: "Ana Silva",
    email: "ana@email.com",
    password: "$2b$10$abcdefghijklmnopqrstuvwxyz", // Mock hashed password
    university: "USP",
    course: "Engenharia",
    age: 20,
    gender: "feminino",
    bio: "Estudante de engenharia, organizada e sociável. Procuro uma colega de quarto tranquila para dividir apartamento perto da universidade.",
    interests: ["estudar", "leitura", "cinema", "academia"],
    lifestyle: {
      sleepSchedule: "cedo",
      cleanliness: "muito_organizado",
      socialLevel: "sociavel",
      studyHabits: "silencioso"
    },
    location: {
      city: "São Paulo",
      state: "SP",
      neighborhood: "Vila Madalena"
    },
    budget: {
      min: 800,
      max: 1200
    },
    preferences: {
      ageRange: { min: 18, max: 25 },
      genderPreference: "feminino",
      lifestyle: {
        sleepSchedule: ["cedo", "moderado"],
        cleanliness: ["organizado", "muito_organizado"],
        socialLevel: ["moderado", "sociavel"],
        studyHabits: ["silencioso", "moderado"]
      }
    },
    profilePicture: "https://i.pravatar.cc/300?img=1",
    isActive: true,
    likedUsers: [],
    dislikedUsers: [],
    matchedUsers: [],
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-15")
  },
  {
    _id: "507f1f77bcf86cd799439012",
    name: "João Santos",
    email: "joao@email.com",
    password: "$2b$10$abcdefghijklmnopqrstuvwxyz", // Mock hashed password
    university: "USP",
    course: "Medicina",
    age: 22,
    gender: "masculino",
    bio: "Estudante de medicina, responsável e focado nos estudos. Busco alguém para dividir república próximo ao hospital das clínicas.",
    interests: ["medicina", "esportes", "música", "tecnologia"],
    lifestyle: {
      sleepSchedule: "moderado",
      cleanliness: "organizado",
      socialLevel: "moderado",
      studyHabits: "silencioso"
    },
    location: {
      city: "São Paulo",
      state: "SP",
      neighborhood: "Pinheiros"
    },
    budget: {
      min: 1000,
      max: 1500
    },
    preferences: {
      ageRange: { min: 20, max: 26 },
      genderPreference: "qualquer",
      lifestyle: {
        sleepSchedule: ["cedo", "moderado"],
        cleanliness: ["organizado", "muito_organizado"],
        socialLevel: ["moderado", "sociavel"],
        studyHabits: ["silencioso"]
      }
    },
    profilePicture: "https://i.pravatar.cc/300?img=2",
    isActive: true,
    likedUsers: ["507f1f77bcf86cd799439011"],
    dislikedUsers: [],
    matchedUsers: [],
    createdAt: new Date("2025-01-02"),
    updatedAt: new Date("2025-01-16")
  },
  {
    _id: "507f1f77bcf86cd799439013",
    name: "Maria Costa",
    email: "maria@email.com",
    password: "$2b$10$abcdefghijklmnopqrstuvwxyz", // Mock hashed password
    university: "UNICAMP",
    course: "Psicologia",
    age: 21,
    gender: "feminino",
    bio: "Estudante de psicologia, criativa e amigável. Procuro uma companhia para dividir um apartamento aconchegante.",
    interests: ["psicologia", "arte", "yoga", "culinaria"],
    lifestyle: {
      sleepSchedule: "tarde",
      cleanliness: "moderado",
      socialLevel: "muito_sociavel",
      studyHabits: "moderado"
    },
    location: {
      city: "Campinas",
      state: "SP",
      neighborhood: "Barão Geraldo"
    },
    budget: {
      min: 600,
      max: 1000
    },
    preferences: {
      ageRange: { min: 19, max: 24 },
      genderPreference: "feminino",
      lifestyle: {
        sleepSchedule: ["moderado", "tarde"],
        cleanliness: ["moderado", "organizado"],
        socialLevel: ["sociavel", "muito_sociavel"],
        studyHabits: ["moderado", "colaborativo"]
      }
    },
    profilePicture: "https://i.pravatar.cc/300?img=3",
    isActive: true,
    likedUsers: [],
    dislikedUsers: [],
    matchedUsers: [],
    createdAt: new Date("2025-01-03"),
    updatedAt: new Date("2025-01-17")
  }
];

export const mockMatches = [
  {
    _id: "607f1f77bcf86cd799439021",
    users: ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439012"],
    status: "matched",
    compatibility: {
      score: 85,
      factors: {
        lifestyle: 80,
        interests: 75,
        budget: 90,
        location: 95,
        preferences: 85
      }
    },
    createdAt: new Date("2025-01-18"),
    updatedAt: new Date("2025-01-18")
  }
];

interface MockMessage {
  _id: string;
  match: string;
  sender: string;
  receiver: string;
  content: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const mockMessages: MockMessage[] = [
  {
    _id: "708f1f77bcf86cd799439031",
    match: "607f1f77bcf86cd799439021",
    sender: "507f1f77bcf86cd799439011",
    receiver: "507f1f77bcf86cd799439012",
    content: "Olá! Vi que também estuda na USP. Que legal!",
    isRead: true,
    createdAt: new Date("2025-01-18T10:00:00Z"),
    updatedAt: new Date("2025-01-18T10:00:00Z")
  },
  {
    _id: "708f1f77bcf86cd799439032",
    match: "607f1f77bcf86cd799439021",
    sender: "507f1f77bcf86cd799439012",
    receiver: "507f1f77bcf86cd799439011",
    content: "Oi Ana! Sim, estou no 4º ano de medicina. E você, que curso faz?",
    isRead: true,
    createdAt: new Date("2025-01-18T10:05:00Z"),
    updatedAt: new Date("2025-01-18T10:05:00Z")
  },
  {
    _id: "708f1f77bcf86cd799439033",
    match: "607f1f77bcf86cd799439021",
    sender: "507f1f77bcf86cd799439011",
    receiver: "507f1f77bcf86cd799439012",
    content: "Engenharia! Estou no 3º ano. Você já tem alguma república em mente?",
    isRead: false,
    createdAt: new Date("2025-01-18T10:10:00Z"),
    updatedAt: new Date("2025-01-18T10:10:00Z")
  }
];
