import { useWalletConnect } from '../hooks/useWalletConnect';

export const WalletConnectButton = () => {
    const { isConnected, address, isLoading, error, connect, disconnect } =
        useWalletConnect();

    const handleClick = () => {
        if (isConnected) {
        disconnect();
        } else {
        connect();
        }
    };

    const formatAddress = (addr) => {
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    };

    return (
        <div className="flex flex-col gap-2 mx-auto items-center">
            <button
                onClick={handleClick}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
            >
                {isLoading ? (
                'Loading...'
                ) : isConnected ? (
                `Disconnect (${formatAddress(address)})`
                ) : (
                'Connect Wallet'
                )}
            </button>
            {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
    );
};