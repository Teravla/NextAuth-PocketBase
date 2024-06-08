export {}

import PocketBase from 'pocketbase';
import type { Adapter, AdapterUser, AdapterAccount, AdapterSession } from "@auth/core/adapters"

// Créez une instance de PocketBase avec l'URL de votre serveur PocketBase
const pb = new PocketBase('http://127.0.0.1:8090');

// Implémenter l'adaptateur en utilisant le type générique
export function pocketbaseAdapter(): Adapter {
    return {
        async createUser(user: AdapterUser): Promise<AdapterUser> {
            // Préparez les données pour la création de l'utilisateur
            const data = {
                "username": user.name || '',  // Vous pouvez générer un nom d'utilisateur si nécessaire
                "email": user.email,
                "password": "defaultPassword123!",  // Vous devez gérer la génération et le stockage du mot de passe de manière sécurisée
                "passwordConfirm": "defaultPassword123!",
                "name": user.name || '',  // Utilisez le nom fourni ou une chaîne vide si non disponible
                "avatar": user.image || ''  // Utilisez l'avatar fourni ou une chaîne vide si non disponible
            };
        
            // Créez l'utilisateur dans PocketBase
            try {
                const record = await pb.collection('users').create(data);
                // Retournez l'utilisateur créé
                return {
                    id: record.id,
                    name: record.username,
                    email: record.email,
                    emailVerified: null,  // L'email n'est pas vérifié
                    image: null  // Pas de gestion d'avatar pour l'instant
                } as AdapterUser ?? null;
            } catch (error) {
                console.error("Error creating user:", error);
                throw new Error('Failed to create user');
            }
        },
        

        async getUser(id: string): Promise<AdapterUser | null> {
            try {
                // Récupérer un utilisateur à partir de son ID dans la base de données
                const record = await pb.collection('users').getOne(id);
        
                // Retournez l'utilisateur récupéré
                return {
                    id: record.id,
                    name: record.username || null,
                    email: record.email,
                    emailVerified: record.verified ? new Date(record.updated) : null,
                    image: record.avatar || null  // Pas de gestion d'avatar pour l'instant
                } as AdapterUser ?? null;
            } catch (error) {
                console.error("Error fetching user:", error);
                return null;  // Retournez null si l'utilisateur n'est pas trouvé ou en cas d'erreur
            }
        },
        

        async getUserByAccount(providerAccountId: Pick<AdapterAccount, "provider" | "providerAccountId">): Promise<AdapterUser | null> {
            try {
                // Utiliser l'ID du fournisseur pour récupérer l'utilisateur dans la base de données
                const record = await pb.collection('users').getList(1, 1, {
                    filter: `providerAccountId='${providerAccountId.providerAccountId}'`
                });
                
                // Vérifier si un enregistrement a été trouvé
                if (record.totalItems === 1) {
                    // Retourner le premier utilisateur trouvé
                    const userRecord = record.items[0];
                    return {
                        id: userRecord.id,
                        name: userRecord.username || null,
                        email: userRecord.email,
                        emailVerified: userRecord.verified ? new Date(userRecord.updated) : null,
                        image: userRecord.avatar || null  // Pas de gestion d'avatar pour l'instant
                    } as AdapterUser;
                } else {
                    // Aucun utilisateur trouvé
                    return null;
                }
            } catch (error) {
                console.error("Error fetching user by account:", error);
                return null;  // Retournez null en cas d'erreur
            }
        },
        

        async updateUser(user: Partial<AdapterUser> & Pick<AdapterUser, "id">): Promise<AdapterUser> {
            // Préparer les données pour la mise à jour de l'utilisateur
            const data: Record<string, any> = {
                "name": user.name || '',  // Nom, facultatif
                "avatar": user.image !== undefined ? user.image : ''  // Avatar, facultatif
            };
        
            // Vérifier si les propriétés de mot de passe sont présentes dans l'objet user
            if ('oldPassword' in user && 'password' in user && 'passwordConfirm' in user) {
                // Propriétés de mot de passe fournies, les inclure dans les données de mise à jour
                data['oldPassword'] = user.oldPassword || '';  // Ancien mot de passe, facultatif
                data['password'] = user.password || '';  // Nouveau mot de passe, facultatif
                data['passwordConfirm'] = user.passwordConfirm || '';  // Confirmation du nouveau mot de passe, facultatif
            }
        
            // Créer la requête de mise à jour dans PocketBase
            try {
                const record = await pb.collection('users').update(user.id, data);
        
                // Retourner l'utilisateur mis à jour
                return {
                    id: record.id,
                    name: record.username,
                    email: record.email,
                    emailVerified: record.verified ? new Date(record.updated) : null,
                    image: record.avatar || null
                };
            } catch (error) {
                console.error("Error updating user:", error);
                throw new Error('Failed to update user');
            }
        },
        

        async linkAccount(account: AdapterAccount): Promise<void> {
            // Préparer les données pour lier le compte à l'utilisateur
            const data = {
                "userId": account.userId,  // ID de l'utilisateur auquel le compte sera lié
                "type": account.type,  // Type du compte (OAuth, Email, etc.)
                "provider": account.provider,  // Fournisseur du compte (Google, Facebook, etc.)
                "providerAccountId": account.providerAccountId,  // ID du compte fourni par le fournisseur
                // Autres propriétés du compte si nécessaire (access_token, refresh_token, etc.)
            };
        
            // Créer le compte dans PocketBase
            try {
                await pb.collection('accounts').create(data);
            } catch (error) {
                console.error("Error linking account:", error);
                throw new Error('Failed to link account');
            }
        }
    };
}
