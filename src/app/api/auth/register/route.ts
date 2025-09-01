import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { nome, email, senha } = await request.json();

    // Aqui você deve implementar a lógica de criação do usuário
    // Por exemplo, validar os dados, verificar se o email já existe,
    // criar o usuário no banco de dados, etc.

    const response = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + '/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nome, email, senha }),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { message: error.message || 'Erro ao criar conta' },
        { status: response.status }
      );
    }

    return NextResponse.json(
      { message: 'Conta criada com sucesso' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}