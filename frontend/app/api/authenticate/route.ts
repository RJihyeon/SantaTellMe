import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    // URL에서 쿼리 파라미터 추출
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const error = url.searchParams.get('error');
    const errorDescription = url.searchParams.get('error_description');

    // 에러가 있는 경우
    if (error) {
        return NextResponse.json(
            { error, error_description: errorDescription || 'Unknown error' },
            { status: 400 }
        );
    }

    // code 파라미터가 없는 경우
    if (!code) {
        return NextResponse.json({ message: 'Missing code parameter' }, { status: 400 });
    }

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/authenticate?code=${code}&error=${error}&error_description=${errorDescription}`,
        {
            method: "GET",
            redirect: 'manual', // 리다이렉트를 수동 처리
        }
    );

    // FastAPI에서 받은 리다이렉트 URL 가져오기
    const redirectLocation = response.headers.get('location');
    const setCookieHeader = response.headers.get('set-cookie'); // FastAPI에서 설정한 쿠키

    if (response.status === 302 || response.status === 307) {
        const headers = new Headers();

        if (setCookieHeader) {
            headers.set('set-cookie', setCookieHeader); // 쿠키를 클라이언트로 전달
        }

        if (redirectLocation) {
            // NextResponse.redirect를 사용하여 리다이렉트 처리
            const redirectResponse = NextResponse.redirect(redirectLocation);

            // 쿠키를 리다이렉트 응답에 추가
            if (setCookieHeader) {
                redirectResponse.headers.set('set-cookie', setCookieHeader);
            }

            return redirectResponse;
        }
    }

    // 예상치 못한 상태 처리
    return new Response('Unexpected response from FastAPI', { status: 500 });

}