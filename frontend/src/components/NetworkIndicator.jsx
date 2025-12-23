import { StacksMainnet, StacksTestnet } from '@stacks/network';

const NetworkIndicator = () => {
    const isMainnet = process.env.NODE_ENV === 'production';
    const networkName = isMainnet ? 'Mainnet' : 'Testnet';
    const indicatorColor = isMainnet ? 'bg-green-500' : 'bg-yellow-500';

    return (
        <div className="hidden xl:flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/20">
            <div className={`w-2 h-2 rounded-full ${indicatorColor} animate-pulse`} />
            <span className="text-xs font-medium text-white/90">
                Stacks {networkName}
            </span>
        </div>
    );
};

export default NetworkIndicator;
