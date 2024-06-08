import { pocketbaseAdapter } from '../src/index';

async function testAdapterFunctions() {
    // Obtenez l'adaptateur
    const adapter = pocketbaseAdapter();

    // Vérifiez si l'adaptateur est défini
    if (!adapter) {
        console.error('Adapter is undefined');
        return;
    }

    // Testez les fonctions de l'adaptateur
    try {
        // Vérifiez si la fonction createUser est définie
        if (adapter.createUser) {
            // Test de la création d'un utilisateur
            const newUser = await adapter.createUser({
                id: 'uniqueUserId', // Ajoutez une valeur unique pour l'ID de l'utilisateur
                name: 'John Doe',
                email: 'john.doe@example.com',
                emailVerified: null, // Indiquez que l'email n'est pas encore vérifié
                image: 'avatar.jpg'
            });
            console.log('New user created:', newUser);
        } else {
            console.error('createUser function is not defined in the adapter');
        }

        // Testez les autres fonctions de l'adaptateur de manière similaire

    } catch (error) {
        console.error('Test failed:', error);
    }
}

// Appel de la fonction de test
testAdapterFunctions();
