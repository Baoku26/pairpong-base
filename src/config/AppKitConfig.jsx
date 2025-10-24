import { createAppKit } from '@reown/appkit';
import { authConnector } from '@reown/appkit-adapter-wagmi';
import { mainnet, arbitrum, polygon } from '@reown/appkit/networks';

const projectId = '6766393c4aa169ab2b0397a1eed1f3e8'

const metadata = {
    name: 'PairPong',
    description: 'Enjoy a game of Pong while predicting crypto market movements!',
    url: window.location.origin,
    icons: ['https://your-icon-url.png'],
};

const networks = [mainnet, arbitrum, polygon];

const ethersAdapter = new authConnector();

export const appKit = createAppKit({
    adapters: [ethersAdapter],
    networks,
    metadata,
    projectId,
    features: {
        analytics: true,
    },
});