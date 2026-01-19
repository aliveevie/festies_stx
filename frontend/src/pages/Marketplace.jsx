import GreetingCardGrid from '../components/GreetingCardGrid';

const Marketplace = () => {
    return (
        <div className="min-h-screen py-12 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
                        Marketplace
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Browse and discover all the beautiful greeting cards created by our community
                    </p>
                </div>
                <GreetingCardGrid
                    showActions={false}
                    maxItems={50}
                />
            </div>
        </div>
    );
};

export default Marketplace;
// Marketplace build 1
// Marketplace build 2
// Marketplace optimization 1
// Marketplace refactor 1
// Marketplace docs update
// Marketplace style update
// Marketplace v1.1.0
// Marketplace cleanup
