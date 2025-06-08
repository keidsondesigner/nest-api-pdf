# 📄 API de Gerenciamento de PDFs

Uma API robusta e completa para gerenciamento de arquivos PDF desenvolvida com **NestJS**, **Express**, **Multer** e **SQLite**. A API oferece funcionalidades completas para upload, listagem, visualização e exclusão de arquivos PDF com validações e tratamento de erros.

## 🚀 Tecnologias Utilizadas

- **NestJS** - Framework Node.js para construção de aplicações server-side escaláveis
- **Express** - Framework web minimalista para Node.js
- **Multer** - Middleware para manipulação de uploads multipart/form-data
- **SQLite** - Banco de dados relacional leve e embarcado
- **TypeORM** - ORM moderno para TypeScript e JavaScript
- **TypeScript** - Superset JavaScript com tipagem estática

## 📁 Estrutura do Projeto

```
src/
├── app.controller.ts      # Controller principal da aplicação
├── app.module.ts          # Módulo raiz da aplicação
├── app.service.ts         # Service principal
├── main.ts               # Ponto de entrada da aplicação
└── pdf/                  # Módulo PDF
    ├── entities/
    │   └── pdf.entity.ts     # Entidade PDF para TypeORM
    ├── interfaces/
    │   └── pdf.interface.ts  # Interfaces TypeScript
    ├── multer.config.ts      # Configuração do Multer
    ├── pdf.controller.ts     # Controller do módulo PDF
    ├── pdf.module.ts         # Módulo PDF
    └── pdf.service.ts        # Service do módulo PDF
```

## ⚙️ Instalação e Configuração

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd api-pdf-management
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Instale as dependências de desenvolvimento (se necessário)
```bash
npm install --save-dev @types/multer @types/express
```

### 4. Configure o ambiente
O projeto está pré-configurado para usar:
- **SQLite** como banco de dados (arquivo `database.sqlite` criado automaticamente)
- **Pasta uploads** para armazenamento de arquivos (criada automaticamente)

## 🏃‍♂️ Executando a Aplicação

### Modo de desenvolvimento
```bash
npm run start:dev
```

### Modo de produção
```bash
npm run build
npm run start:prod
```

A aplicação estará disponível em `http://localhost:3000`

## 📡 Endpoints da API

### 📤 Upload de PDFs
**POST** `/pdf/upload`

Permite upload de até 10 arquivos PDF simultaneamente.

**Headers:**
```
Content-Type: multipart/form-data
```

**Body (form-data):**
- `files`: Arquivos PDF (máximo 10 arquivos, 10MB cada)

**Exemplo de resposta:**
```json
{
  "message": "2 arquivo(s) PDF enviado(s) com sucesso",
  "pdfs": [
    {
      "id": 1,
      "filename": "1640995200000-123456789.pdf",
      "originalname": "documento.pdf",
      "mimetype": "application/pdf",
      "size": 6024567,
      "path": "./uploads/1640995200000-123456789.pdf",
      "uploadDate": "2024-01-01T10:00:00.000Z"
    }
  ]
}
```

### 📋 Listar todos os PDFs
**GET** `/pdf`

Retorna lista de todos os PDFs armazenados.

**Exemplo de resposta:**
```json
[
  {
    "id": 1,
    "filename": "1640995200000-123456789.pdf",
    "originalname": "documento.pdf",
    "mimetype": "application/pdf",
    "size": 424567,
    "path": "./uploads/1640995200000-123456789.pdf",
    "uploadDate": "2024-01-01T10:00:00.000Z"
  }
]
```

### 📄 Obter PDF por ID
**GET** `/pdf/{id}`

Retorna o arquivo PDF para visualização ou download.

**Parâmetros:**
- `id`: ID do PDF (número inteiro)

**Headers de resposta:**
```
Content-Type: application/pdf
Content-Disposition: inline; filename="documento.pdf"
```

### 🗑️ Excluir PDF por ID
**DELETE** `/pdf/{id}`

Remove o PDF do banco de dados e do sistema de arquivos.

**Parâmetros:**
- `id`: ID do PDF (número inteiro)

**Exemplo de resposta:**
```json
{
  "message": "PDF com ID 1 removido com sucesso"
}
```

## 🛡️ Validações e Segurança

### Validações de Upload
- ✅ Apenas arquivos com MIME type `application/pdf`
- ✅ Tamanho máximo de 7MB por arquivo
- ✅ Máximo de 10 arquivos por upload
- ✅ Nomes de arquivo únicos (timestamp + random)

### Tratamento de Erros
- ❌ `400 Bad Request` - Arquivo não é PDF ou muito grande
- ❌ `404 Not Found` - PDF não encontrado
- ❌ `500 Internal Server Error` - Erros do servidor

## 🧪 Testando a API

### Usando cURL

**Upload de PDF:**
```bash
curl -X POST \
  http://localhost:3000/pdf/upload \
  -H 'Content-Type: multipart/form-data' \
  -F 'files=@/caminho/para/seu/arquivo.pdf'
```

**Listar PDFs:**
```bash
curl -X GET http://localhost:3000/pdf
```

**Obter PDF:**
```bash
curl -X GET http://localhost:3000/pdf/1 --output documento.pdf
```

**Excluir PDF:**
```bash
curl -X DELETE http://localhost:3000/pdf/1
```

### Usando Postman

1. **Upload**:
   - Método: POST
   - URL: `http://localhost:3000/pdf/upload`
   - Headers: `Content-Type: application/pdf`
   - Headers: `Content-Type: multipart/form-data`
   - Body: form-data, key: `files`, value: selecionar arquivos PDF

2. **Listar**:
   - Método: GET
   - URL: `http://localhost:3000/pdf`

3. **Visualizar**:
   - Método: GET
   - URL: `http://localhost:3000/pdf/1`

4. **Excluir**:
   - Método: DELETE
   - URL: `http://localhost:3000/pdf/1`

## 📊 Modelo de Dados

### Entidade PDF
```typescript
{
  id: number;           // Identificador único
  filename: string;     // Nome do arquivo no servidor
  originalname: string; // Nome original do arquivo
  mimetype: string;     // Tipo MIME (sempre 'application/pdf')
  size: number;         // Tamanho em bytes
  path: string;         // Caminho do arquivo no servidor
  uploadDate: Date;     // Data e hora do upload
}
```
