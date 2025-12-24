import ContractInfo from '../components/ContractInfo';
import RoyaltyInfo from '../components/RoyaltyInfo';

const About = () => {
    return (
        <div className="min-h-screen py-12 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
                        About Festies
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Learn more about our mission, how the technology works, and the contract details.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {/* Contract Information */}
                    <ContractInfo />

                    {/* Royalty Information */}
                    <RoyaltyInfo />
                </div>

                {/* Mission Section */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Our Mission</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">💝</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Spread Joy</h3>
                            <p className="text-gray-600">
                                Create lasting memories through personalized digital greetings that touch hearts and bring people together.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">🔗</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Blockchain Technology</h3>
                            <p className="text-gray-600">
                                Leverage the power of Stacks blockchain to ensure your greetings are permanent, verifiable, and truly yours.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">🎨</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Creator Support</h3>
                            <p className="text-gray-600">
                                Built-in royalty system ensures creators continue to benefit from their work through secondary sales.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
