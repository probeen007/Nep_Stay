import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AnimatedHospitalityPhrase = () => {
    const [currentPhrase, setCurrentPhrase] = useState(0);

    const phrases = [
        {
            mainText: "अतिथि देवो भव:",
            subText: "नेपाली परम्परा",
            language: "nepali"
        },
        {
            mainText: "Guest is God",
            subText: "A Sacred Nepali Tradition",
            language: "english"
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentPhrase((prev) => (prev + 1) % phrases.length);
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full max-w-4xl mx-auto px-4">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentPhrase}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="text-center space-y-2"
                >
                    <div
                        className={`text-2xl md:text-3xl lg:text-4xl font-semibold ${phrases[currentPhrase].language === 'nepali'
                                ? 'font-devanagari tracking-wider'
                                : 'font-display tracking-wide'
                            }`}
                        style={{
                            fontFamily: phrases[currentPhrase].language === 'nepali'
                                ? '"Noto Sans Devanagari", "Mukti", serif'
                                : 'inherit'
                        }}
                    >
                        <span className="bg-gradient-to-r from-yellow-200 via-yellow-100 to-white bg-clip-text text-transparent">
                            {phrases[currentPhrase].mainText}
                        </span>
                    </div>

                    <div
                        className={`text-base md:text-lg opacity-85 italic ${phrases[currentPhrase].language === 'nepali'
                                ? 'font-devanagari'
                                : 'font-display'
                            }`}
                        style={{
                            fontFamily: phrases[currentPhrase].language === 'nepali'
                                ? '"Noto Sans Devanagari", "Mukti", serif'
                                : 'inherit'
                        }}
                    >
                        <span className="bg-gradient-to-r from-yellow-200 via-yellow-100 to-white bg-clip-text text-transparent">
                            {phrases[currentPhrase].subText}
                        </span>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default AnimatedHospitalityPhrase;