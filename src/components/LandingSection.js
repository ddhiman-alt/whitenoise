import React from "react";

const LandingSection = () => {
    const benefits = [
        {
            icon: "🧠",
            title: "Improve Focus",
            description:
                "Block out distractions and enhance concentration with ambient sounds that help you stay in the zone.",
        },
        {
            icon: "😴",
            title: "Better Sleep",
            description:
                "Fall asleep faster and enjoy deeper rest with soothing sounds that calm your mind.",
        },
        {
            icon: "🧘",
            title: "Reduce Stress",
            description:
                "Lower anxiety and stress levels with natural sounds that promote relaxation.",
        },
        {
            icon: "📚",
            title: "Study & Work",
            description:
                "Create the perfect ambiance for studying, working, or any task requiring concentration.",
        },
    ];

    const features = [
        {
            icon: "⏱️",
            title: "Sleep Timer",
            description:
                "Set a timer to automatically stop sounds after a specified duration. Perfect for falling asleep.",
        },
        {
            icon: "🔒",
            title: "Background Playback",
            description:
                "Audio continues playing even when you lock your phone or switch apps. Install as PWA for best experience.",
        },
        {
            icon: "💾",
            title: "Save Playlists",
            description:
                "Create and save your favorite sound mixes to quickly load them anytime.",
        },
        {
            icon: "🎚️",
            title: "Mix & Match",
            description:
                "Combine multiple sounds with individual volume controls to create your perfect ambiance.",
        },
    ];

    return (
        <section className="landing-section">
            <h2>Why Use WhiteNoise?</h2>

            <div className="benefits-grid">
                {benefits.map((benefit, index) => (
                    <div className="benefit-card" key={index}>
                        <div className="benefit-icon">{benefit.icon}</div>
                        <h3>{benefit.title}</h3>
                        <p>{benefit.description}</p>
                    </div>
                ))}
            </div>

            <h2 style={{ marginTop: "50px" }}>Features</h2>

            <div className="benefits-grid">
                {features.map((feature, index) => (
                    <div className="benefit-card feature-card" key={index}>
                        <div className="benefit-icon">{feature.icon}</div>
                        <h3>{feature.title}</h3>
                        <p>{feature.description}</p>
                    </div>
                ))}
            </div>

            <div className="how-to-use">
                <h3>💡 Tips for Background Playback</h3>
                <div className="tips-list">
                    <div className="tip-item">
                        <span className="tip-icon">📱</span>
                        <div className="tip-content">
                            <strong>Install as App</strong>
                            <p>
                                Add WhiteNoise to your home screen for the best
                                background playback experience.
                            </p>
                        </div>
                    </div>
                    <div className="tip-item">
                        <span className="tip-icon">🔊</span>
                        <div className="tip-content">
                            <strong>Start Audio First</strong>
                            <p>
                                Make sure to start playing sounds before locking
                                your phone.
                            </p>
                        </div>
                    </div>
                    <div className="tip-item">
                        <span className="tip-icon">⏱️</span>
                        <div className="tip-content">
                            <strong>Use Sleep Timer</strong>
                            <p>
                                Set a timer to automatically stop sounds - saves
                                battery while you sleep.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LandingSection;
