import { getPlaylistItems, getUsersPlaylists } from '../../../../lib/spotify';
import { getToken, JWT } from 'next-auth/jwt';

const handler = async (req: any, res: any) => {
    const jwt: JWT | null = await getToken({ req });
    let offset: number = 0;	
    let limit: number = 50;

    if (req.query.offset) {
        offset = req.query.offset;
    }

    if (req.query.limit) {
        limit = req.query.limit;
    }

    const { playListId } = req.query;

    if (!jwt) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    const response = await getPlaylistItems(jwt.accessToken, playListId, offset, limit);
    const items = await response.json();
    res.status(200).json(items);
}

export default handler;