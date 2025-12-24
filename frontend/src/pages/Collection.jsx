import GreetingCardGrid from '../components/GreetingCardGrid';

const Collection = () => {
    return (
        <div className="min-h-screen py-12 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
                        My Collection
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        View and manage your greeting cards. Transfer, approve, or burn your NFTs.
                    </p>
                </div>
                <GreetingCardGrid
                    showActions={true}
                    maxItems={100}
                />
            </div>
        </div>
    );
};

export default Collection;
