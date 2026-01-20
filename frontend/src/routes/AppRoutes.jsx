import { Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import CreateGreeting from '../pages/CreateGreeting';
import Dashboard from '../pages/Dashboard';
import Marketplace from '../pages/Marketplace';
import Collection from '../pages/Collection';
import About from '../pages/About';
import Settings from '../pages/Settings';
import Profile from '../pages/Profile';
import Explore from '../pages/Explore';
import Help from '../pages/Help';
import Contact from '../pages/Contact';
import NotFound from '../pages/NotFound';
import Blog from '../pages/Blog';

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

            <Route
                path="/settings"
                element={
                    <motion.div
                        key="settings"
                        initial="initial"
                        animate="in"
                        exit="out"
                        variants={pageVariants}
                        transition={pageTransition}
                    >
                        <Settings />
                    </motion.div>
                }
            />

            <Route
                path="/profile"
                element={
                    <motion.div
                        key="profile"
                        initial="initial"
                        animate="in"
                        exit="out"
                        variants={pageVariants}
                        transition={pageTransition}
                    >
                        <Profile />
                    </motion.div>
                }
            />

            <Route
                path="/explore"
                element={
                    <motion.div
                        key="explore"
                        initial="initial"
                        animate="in"
                        exit="out"
                        variants={pageVariants}
                        transition={pageTransition}
                    >
                        <Explore />
                    </motion.div>
                }
            />

            <Route
                path="/help"
                element={
                    <motion.div
                        key="help"
                        initial="initial"
                        animate="in"
                        exit="out"
                        variants={pageVariants}
                        transition={pageTransition}
                    >
                        <Help />
                    </motion.div>
                }
            />

            <Route
                path="/contact"
                element={
                    <motion.div
                        key="contact"
                        initial="initial"
                        animate="in"
                        exit="out"
                        variants={pageVariants}
                        transition={pageTransition}
                    >
                        <Contact />
                    </motion.div>
                }
            />

            <Route
                path="/blog"
                element={
                    <motion.div
                        key="blog"
                        initial="initial"
                        animate="in"
                        exit="out"
                        variants={pageVariants}
                        transition={pageTransition}
                    >
                        <Blog />
                    </motion.div>
                }
            />

            {/* 404 Not Found */}
            <Route
                path="/404"
                element={
                    <motion.div
                        key="not-found"
                        initial="initial"
                        animate="in"
                        exit="out"
                        variants={pageVariants}
                        transition={pageTransition}
                    >
                        <NotFound />
                    </motion.div>
                }
            />

            {/* Catch all route - redirect to 404 */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AppRoutes;
