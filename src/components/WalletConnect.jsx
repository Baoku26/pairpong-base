import { useWalletConnect } from '../hooks/useWalletConnect';
import { Wallet, LogOut } from 'lucide-react';

export const WalletConnectButton = () => {
    const { isConnected, address, isLoading, error, connect, disconnect } =
        useWalletConnect();

    const handleClick = async () => {
        if (isConnected) {
            disconnect();
        } else {
            await connect();
        }
    };

    const formatAddress = (addr) => {
        if (!addr) return '';
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    };

    return (
        <div className="flex flex-col gap-3 items-center justify-center mb-6">
            <button
                onClick={handleClick}
                disabled={isLoading}
                className={`
                    flex items-center gap-2 px-6 py-3 rounded-lg font-semibold
                    transition-all duration-300 uppercase tracking-wide text-sm
                    ${isConnected
                        ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white'
                        : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white'
                    }
                    disabled:opacity-50 disabled:cursor-not-allowed
                    shadow-lg hover:shadow-xl
                `}
            >
                {isLoading ? (
                    <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Connecting...</span>
                    </>
                ) : isConnected ? (
                    <>
                        <LogOut size={18} />
                        <span>Disconnect</span>
                        <span className="ml-2 text-xs opacity-90">
                            ({formatAddress(address)})
                        </span>
                    </>
                ) : (
                    <>
                        <Wallet size={18} />
                        <span>Connect Wallet</span>
                    </>
                )}
            </button>
            
            {error && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg w-full">
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                    <p className="text-red-400 text-xs font-medium">{error}</p>
                </div>
            )}

            {isConnected && (
                <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/30 rounded-lg w-full">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <p className="text-green-400 text-xs font-medium">
                        Wallet connected
                    </p>
                </div>
            )}
        </div>
    );
};