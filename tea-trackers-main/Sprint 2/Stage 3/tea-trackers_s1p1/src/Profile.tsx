import React, { useContext, useState } from "react";
import { UserContext } from "./UserContext";
import "./Profile.css"; // Import a CSS file for styling

const Profile: React.FC = () => {
    
    const { user } = useContext(UserContext);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError("Les nouveaux mots de passe ne correspondent pas!");
            return;
        }

        try {
            setLoading(true);

            // Vérifier d'abord l'ancien mot de passe
            const verifyResponse = await fetch(`https://tt-api.azurewebsites.net/users/${user?.username}`, {
                method: 'POST', // Utilisez une méthode POST pour vérifier le mot de passe
                headers: {
                    'Content-Type': 'application/json',
                    // Include other headers as needed, like authentication tokens
                },
                body: JSON.stringify({
                    username: user?.username,
                    password: oldPassword,
                }),
            });

            if (!verifyResponse.ok) {
                setError("L'ancien mot de passe est incorrect.");
                setLoading(false);
                return;
            }

            // Si l'ancien mot de passe est correct, mettez à jour le mot de passe
            const response = await fetch(`https://tt-api.azurewebsites.net/users/${user?.username}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    // Include other headers as needed, like authentication tokens
                },
                body: JSON.stringify({
                    old_password: oldPassword,
                    new_password: newPassword,
                }),
            });

            if (response.ok) {
                alert("Mot de passe mis à jour avec succès");
                // Vous pouvez rediriger vers une page de connexion ou effectuer d'autres actions en cas de succès
            } else {
                const errorData = await response.json();
                setError(`Erreur : ${errorData.message}`);
            }
        } catch (error) {
            setError("Une erreur s'est produite lors de la communication avec le serveur.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="profile-container"> 
            <h1>Profile</h1>
            {user ? (
                <>
                    <p><strong>Username:</strong> {user.username}</p>
                    <p><strong>Email:</strong> {user.mail}</p>

                    <form onSubmit={handleChangePassword} className="password-form"> 
                        <input
                            type="password"
                            placeholder="Ancien mot de passe"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            className="password-input" 
                        />
                        <input
                            type="password"
                            placeholder="Nouveau mot de passe"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="password-input" 
                        />
                        <input
                            type="password"
                            placeholder="Confirmer le nouveau mot de passe"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="password-input" 
                        />
                        <button type="submit" disabled={loading} className="password-button">Changer le mot de passe</button> {/* Apply styles to the button */}
                    </form>

                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    {loading && <p>Chargement en cours...</p>}
                </>
            ) : null /* Ne rien afficher si l'utilisateur n'est pas connecté */}
        </div>
    );
};

export default Profile;
