import { useState, useEffect } from 'react';
import { useAppKit, useAppKitAccount } from '@reown/appkit/react';

export const useWalletConnect = () => {
    const { open } = useAppKit();
    const { address, chainId, isConnected } = useAppKitAccount();
    const [state, setState] = useState({
        isConnected: false,
        address: null,
        chainId: null,
        isLoading: false,
        error: null,
    });

    useEffect(() => {
        setState({
        isConnected,
        address: address || null,
        chainId: chainId || null,
        isLoading: false,
        error: null,
        });
    }, [isConnected, address, chainId]);

    const connect = async () => {
        try {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        await open();
        } catch (err) {
        setState(prev => ({
            ...prev,
            error: err instanceof Error ? err.message : 'Connection failed',
            isLoading: false,
        }));
        }
    };

    const disconnect = async () => {
        try {
        setState(prev => ({ ...prev, isLoading: true }));
        // Disconnect logic handled by AppKit
        setState({
            isConnected: false,
            address: null,
            chainId: null,
            isLoading: false,
            error: null,
        });
        } catch (err) {
        setState(prev => ({
            ...prev,
            error: err instanceof Error ? err.message : 'Disconnection failed',
            isLoading: false,
        }));
        }
    };

    return {
        ...state,
        connect,
        disconnect,
    };
};