import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User';
import { connectDatabase } from '../database/connection';

// Load environment variables
dotenv.config();

const sampleUsers = [
    {
        name: "João Silva",
        email: "joao.silva@email.com",
        password: "Password123",
        university: "Universidade de São Paulo",
        course: "Engenharia da Computação",
        graduationYear: 2025,
        age: 20,
        gender: "male",
        bio: "Estudante de engenharia, gosto de programar e jogar videogames. Procuro um colega de quarto organizado e tranquilo.",
        interests: ["programação", "videogames", "filmes", "tecnologia"],
        lifestyle: {
            sleepSchedule: "night-owl",
            cleanliness: "clean",
            socialLevel: "moderate",
            studyHabits: "quiet",
            smokingDrinking: "occasionally"
        },
        location: {
            city: "São Paulo",
            state: "SP",
            country: "Brasil",
            preferredAreas: ["Vila Madalena", "Pinheiros", "Butantã"]
        },
        budget: {
            min: 800,
            max: 1500,
            currency: "BRL"
        },
        preferences: {
            genderPreference: "no-preference",
            ageRange: { min: 18, max: 25 },
            maxRoommates: 2,
            petFriendly: false,
            smokingOk: false,
            drinkingOk: true
        }
    },
    {
        name: "Maria Santos",
        email: "maria.santos@email.com",
        password: "Password123",
        university: "Universidade de São Paulo",
        course: "Medicina",
        graduationYear: 2026,
        age: 19,
        gender: "female",
        bio: "Estudante de medicina, muito organizada e dedicada aos estudos. Procuro ambiente calmo para estudar.",
        interests: ["medicina", "leitura", "yoga", "culinária"],
        lifestyle: {
            sleepSchedule: "early-bird",
            cleanliness: "very-clean",
            socialLevel: "social",
            studyHabits: "very-quiet",
            smokingDrinking: "never"
        },
        location: {
            city: "São Paulo",
            state: "SP",
            country: "Brasil",
            preferredAreas: ["Liberdade", "Bela Vista", "Consolação"]
        },
        budget: {
            min: 1000,
            max: 2000,
            currency: "BRL"
        },
        preferences: {
            genderPreference: "same",
            ageRange: { min: 18, max: 22 },
            maxRoommates: 1,
            petFriendly: false,
            smokingOk: false,
            drinkingOk: false
        }
    },
    {
        name: "Pedro Oliveira",
        email: "pedro.oliveira@email.com",
        password: "Password123",
        university: "Universidade Estadual de Campinas",
        course: "Administração",
        graduationYear: 2024,
        age: 22,
        gender: "male",
        bio: "Estudante de administração no último ano. Gosto de música, esportes e sair com amigos nos fins de semana.",
        interests: ["música", "futebol", "festas", "empreendedorismo"],
        lifestyle: {
            sleepSchedule: "flexible",
            cleanliness: "moderate",
            socialLevel: "very-social",
            studyHabits: "moderate",
            smokingDrinking: "regularly"
        },
        location: {
            city: "Campinas",
            state: "SP",
            country: "Brasil",
            preferredAreas: ["Centro", "Cambuí", "Barão Geraldo"]
        },
        budget: {
            min: 600,
            max: 1200,
            currency: "BRL"
        },
        preferences: {
            genderPreference: "no-preference",
            ageRange: { min: 20, max: 25 },
            maxRoommates: 3,
            petFriendly: true,
            smokingOk: true,
            drinkingOk: true
        }
    },
    {
        name: "Ana Costa",
        email: "ana.costa@email.com",
        password: "Password123",
        university: "Universidade Federal do Rio de Janeiro",
        course: "Psicologia",
        graduationYear: 2025,
        age: 21,
        gender: "female",
        bio: "Estudante de psicologia, amo animais e natureza. Procuro um ambiente harmonioso e acolhedor.",
        interests: ["psicologia", "animais", "natureza", "artes"],
        lifestyle: {
            sleepSchedule: "early-bird",
            cleanliness: "clean",
            socialLevel: "moderate",
            studyHabits: "quiet",
            smokingDrinking: "never"
        },
        location: {
            city: "Rio de Janeiro",
            state: "RJ",
            country: "Brasil",
            preferredAreas: ["Copacabana", "Ipanema", "Botafogo"]
        },
        budget: {
            min: 900,
            max: 1800,
            currency: "BRL"
        },
        preferences: {
            genderPreference: "same",
            ageRange: { min: 18, max: 24 },
            maxRoommates: 2,
            petFriendly: true,
            smokingOk: false,
            drinkingOk: true
        }
    },
    {
        name: "Carlos Ferreira",
        email: "carlos.ferreira@email.com",
        password: "Password123",
        university: "Universidade Federal de Minas Gerais",
        course: "Direito",
        graduationYear: 2024,
        age: 23,
        gender: "male",
        bio: "Estudante de direito focado nos estudos. Gosto de ler, debater e praticar esportes nos fins de semana.",
        interests: ["direito", "leitura", "debate", "basquete"],
        lifestyle: {
            sleepSchedule: "night-owl",
            cleanliness: "very-clean",
            socialLevel: "social",
            studyHabits: "quiet",
            smokingDrinking: "occasionally"
        },
        location: {
            city: "Belo Horizonte",
            state: "MG",
            country: "Brasil",
            preferredAreas: ["Savassi", "Funcionários", "Centro"]
        },
        budget: {
            min: 700,
            max: 1400,
            currency: "BRL"
        },
        preferences: {
            genderPreference: "no-preference",
            ageRange: { min: 20, max: 26 },
            maxRoommates: 2,
            petFriendly: false,
            smokingOk: false,
            drinkingOk: true
        }
    }
];

export const seedUsers = async () => {
    try {
        console.log('🌱 Starting database seeding...');
        
        // Connect to database
        await connectDatabase();
        
        // Clear existing users
        await User.deleteMany({});
        console.log('🗑️  Cleared existing users');
        
        // Create sample users
        const createdUsers = await User.create(sampleUsers);
        console.log(`✅ Created ${createdUsers.length} sample users`);
        
        console.log('📋 Sample users created:');
        createdUsers.forEach(user => {
            console.log(`   - ${user.name} (${user.email})`);
        });
        
        console.log('🎉 Database seeding completed successfully!');
        
    } catch (error) {
        console.error('❌ Error seeding database:', error);
    } finally {
        await mongoose.connection.close();
        console.log('📡 Database connection closed');
    }
};

// Run seeding if this file is executed directly
if (require.main === module) {
    seedUsers();
}
