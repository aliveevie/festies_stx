import { Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import CreateGreeting from '../pages/CreateGreeting';
import Dashboard from '../pages/Dashboard';
import Marketplace from '../pages/Marketplace'; // We will create this next
import Collection from '../pages/Collection'; // We will create this next
import About from '../pages/About'; // We will create this next

// Page transition variants
const pageVariants = {
    initial: {
        opacity: 0,
        y: 20,
    },
    in: {
        opacity: 1,
        y: 0,
    },
    out: {
        opacity: 0,
        y: -20,
    },
};

const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5,
};

const AppRoutes = () => {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <motion.div
                        key="home"
                        initial="initial"
                        animate="in"
                        exit="out"
                        variants={pageVariants}
                        transition={pageTransition}
                    >
                        <Hero />
                    </motion.div>
                }
            />

            <Route
                path="/create"
                element={
                    <motion.div
                        key="create"
                        initial="initial"
                        animate="in"
                        exit="out"
                        variants={pageVariants}
                        transition={pageTransition}
                    >
                        <CreateGreeting />
                    </motion.div>
                }
            />

            <Route
                path="/dashboard"
                element={
                    <motion.div
                        key="dashboard"
                        initial="initial"
                        animate="in"
                        exit="out"
                        variants={pageVariants}
                        transition={pageTransition}
                    >
                        <Dashboard />
                    </motion.div>
                }
            />

            <Route
                path="/marketplace"
                element={
                    <motion.div
                        key="marketplace"
                        initial="initial"
                        animate="in"
                        exit="out"
                        variants={pageVariants}
                        transition={pageTransition}
                    >
                        <Marketplace />
                    </motion.div>
                }
            />

            <Route
                path="/collection"
                element={
                    <motion.div
                        key="collection"
                        initial="initial"
                        animate="in"
                        exit="out"
                        variants={pageVariants}
                        transition={pageTransition}
                    >
                        <Collection />
                    </motion.div>
                }
            />

            <Route
                path="/about"
                element={
                    <motion.div
                        key="about"
                        initial="initial"
                        animate="in"
                        exit="out"
                        variants={pageVariants}
                        transition={pageTransition}
                    >
                        <About />
                    </motion.div>
                }
            />

            {/* Catch all route - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRoutes;
