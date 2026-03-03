import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const filePath = searchParams.get('path');

    if (!filePath) {
        return NextResponse.json({ error: 'Path is required' }, { status: 400 });
    }

    // Security check: ensure the path is within the PRD directory
    const prdDirectory = path.join(process.cwd(), 'PRD');
    // Decode the URL component components to handle spaces and special characters
    const safeFilePath = path.normalize(filePath).replace(/^(\.\.(\/|\\|$))+/, '');
    const absolutePath = path.join(prdDirectory, safeFilePath);

    if (!absolutePath.startsWith(prdDirectory)) {
        return NextResponse.json({ error: 'Invalid path' }, { status: 403 });
    }

    try {
        const content = await fs.promises.readFile(absolutePath, 'utf-8');
        return new NextResponse(content, {
            headers: {
                'Content-Type': 'text/plain',
            },
        });
    } catch (error) {
        console.error('Error reading PRD file:', error);
        return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }
}
