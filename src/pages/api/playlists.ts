import { getUsersPlaylists } from '../../lib/spotify';
import { getToken, JWT } from 'next-auth/jwt';

const handler = async (req: any, res: any) => {
    const jwt: JWT | null = await getToken({ req });
    if (!jwt) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    const response = await getUsersPlaylists(jwt.accessToken);
    const items = await response.json();
    res.status(200).json(items);
}

export default handler;