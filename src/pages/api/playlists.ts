import { getUsersPlaylists } from '../../lib/spotify';
import { getToken, JWT } from 'next-auth/jwt';

const handler = async (req: any, res: any) => {
    const jwt: JWT | null = await getToken({ req });
    let offset: number = 0;	
    if (req.query.offset) {
        offset = req.query.offset;
    }
    if (!jwt) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    const response = await getUsersPlaylists(jwt.accessToken, offset);
    const items = await response.json();
    res.status(200).json(items);
}

export default handler;