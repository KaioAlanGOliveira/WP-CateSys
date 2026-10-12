"# WP-CateSys" 

# CateSys — Sistema de Gerenciamento de Catequese

Sistema web desenvolvido para organizar e facilitar a administração das atividades de catequese, centralizando o gerenciamento de alunos, professores, turmas, aulas e registros de presença.

O **CateSys** utiliza Angular no frontend e Java com Jakarta EE no backend, com persistência de dados em MySQL. O projeto busca oferecer uma interface organizada e uma estrutura de código modular, facilitando a manutenção e a evolução do sistema.

## 📌 Sobre o projeto

O CateSys foi desenvolvido para apoiar a organização das atividades de catequese, permitindo o gerenciamento dos principais registros necessários para o acompanhamento das turmas e dos alunos.

A aplicação é dividida em duas partes:

- **CateSysNg:** interface web desenvolvida com Angular.
- **CateSysSrv:** API REST desenvolvida em Java, responsável pelas operações de negócio e pelo acesso aos dados.

## ✨ Funcionalidades

### 👨‍🎓 Alunos
- Cadastro, consulta, edição e exclusão de alunos.
- Pesquisa por matrícula e nome.
- Registro de informações de contato e dados do responsável.
- Controle de status do aluno.
- Consulta de alunos associados às turmas.

### 👨‍🏫 Professores
- Cadastro e gerenciamento de professores.
- Registro de matrícula e informações de contato.
- Controle de status dos registros.

### 📚 Turmas
- Cadastro e consulta de turmas.
- Associação de professores responsáveis.
- Associação de alunos às respectivas turmas.
- Controle de status das turmas.

### 🗓️ Aulas
- Cadastro e consulta de aulas.
- Associação de aulas às turmas.
- Consulta por código, turma e data.
- Visualização de informações relacionadas à turma.

### ✅ Controle de presença
- Registro da presença dos alunos nas aulas.
- Associação dos registros de presença às aulas e aos alunos.
- Identificação de presença e ausência.

### 🔐 Acesso ao sistema
- Tela de login.
- Navegação entre as áreas do sistema.
- Interface organizada com menu lateral.

## 🛠️ Tecnologias utilizadas

| Tecnologia | Aplicação |
|---|---|
| Java 17 | Linguagem do backend |
| Jakarta EE | APIs empresariais e recursos REST |
| JAX-RS | Construção dos endpoints REST |
| CDI | Injeção de dependências |
| Jakarta Persistence (JPA) | Persistência e mapeamento de entidades |
| Hibernate | Tecnologia ORM |
| Maven | Gerenciamento de dependências e build |
| WildFly 40 | Servidor de aplicações |
| MySQL | Banco de dados relacional |
| Angular 21 | Desenvolvimento do frontend |
| TypeScript | Lógica da interface |
| PrimeNG | Componentes visuais |
| PrimeIcons | Ícones da interface |
| RxJS | Programação reativa no frontend |

## 🏗️ Arquitetura do projeto

O repositório utiliza uma organização separada entre frontend e backend.

```text
WP-CateSys/
│
├── CateSysNg/
│   ├── src/
│   │   └── app/
│   │       ├── core/
│   │       ├── models/
│   │       ├── modules/
│   │       └── shared/
│   ├── angular.json
│   ├── package.json
│   └── proxy.conf.json
│
├── CateSysSrv/
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── br/com/kaio/catesys/
│   │       │       ├── bss/
│   │       │       ├── domain/
│   │       │       └── eps/
│   │       └── resources/
│   │           └── META-INF/
│   │               └── persistence.xml
│   └── pom.xml
│
├── Documentacao/
│   ├── CateSysSql.sql
│   ├── ModeloDados.mwb
│   ├── Prototipo.pptx
│   └── configuracoes.txt
│
└── README.md
```

### Organização do backend

- **`domain/`** — entidades que representam os dados do sistema.
- **`bss/`** — classes responsáveis pelas operações de negócio e pelo acesso aos dados.
- **`eps/`** — endpoints REST que recebem requisições HTTP e disponibilizam as operações da API.

### Organização do frontend

- **`modules/`** — funcionalidades organizadas por áreas, como alunos, professores, turmas, aulas e login.
- **`models/`** — modelos TypeScript utilizados para representar os dados.
- **`shared/`** — componentes compartilhados, como o menu lateral e os diálogos.
- **`core/`** — recursos centrais da aplicação.

## 🗄️ Banco de dados

O projeto utiliza MySQL e disponibiliza o script de criação do banco em:

`Documentacao/CateSysSql.sql`

O modelo contempla as seguintes tabelas principais:

- `aluno`
- `professor`
- `turma`
- `turma_aluno`
- `aula`
- `presenca`

As tabelas possuem chaves primárias e relacionamentos para representar as associações entre alunos, professores, turmas e aulas.

O arquivo `Documentacao/ModeloDados.mwb` contém o modelo de dados desenvolvido no MySQL Workbench.

## 🚀 Como executar o projeto

### Pré-requisitos

Antes de iniciar, tenha instalado e configurado:

- Java JDK 17 ou superior.
- Apache Maven.
- Node.js e npm compatíveis com a versão do Angular utilizada.
- MySQL Server.
- WildFly compatível com a configuração do backend.

### 1. Clone o repositório

```bash
git clone https://github.com/KaioAlanGOliveira/WP-CateSys.git
cd WP-CateSys
```

### 2. Configure o banco de dados

Execute o script SQL disponível em `Documentacao/CateSysSql.sql` no MySQL Workbench ou em outro cliente MySQL.

Configure o datasource do WildFly para acessar o banco `catesys`. A unidade de persistência utilizada pelo backend é `MeuPu`.

Verifique também as credenciais e as configurações da conexão com o banco no ambiente local.

### 3. Prepare o backend

No terminal, entre na pasta do servidor:

```bash
cd CateSysSrv
```

Execute o build com Maven:

```bash
mvn clean package
```

Depois, configure e inicie o WildFly conforme o ambiente local e faça o deploy do artefato gerado em `target/ROOT.war`, caso ele ainda não tenha sido implantado automaticamente.

### 4. Prepare o frontend

Em outro terminal, entre na pasta Angular:

```bash
cd CateSysNg
```

Instale as dependências:

```bash
npm install
```

Inicie o servidor de desenvolvimento:

```bash
npm start
```

Por padrão, o Angular disponibiliza a aplicação em:

`http://localhost:4200`

O frontend e o backend precisam estar configurados corretamente para que as operações que utilizam a API funcionem.

## 🔌 API REST

O backend disponibiliza endpoints REST para as operações do sistema. Entre os recursos identificados no código estão:

| Recurso | Caminho base |
|---|---|
| Alunos | `/aluno` |
| Professores | `/professor` |
| Turmas | `/turma` |
| Aulas | `/aula` |
| Login | `/login` |

Os endpoints aceitam requisições HTTP e utilizam JSON para a comunicação entre o frontend e o backend, conforme a configuração de cada recurso.

## 📁 Documentação adicional

A pasta `Documentacao/` reúne materiais de apoio ao projeto:

- Script SQL de criação do banco de dados.
- Modelo de dados do MySQL Workbench.
- Protótipo da aplicação.
- Arquivo com anotações de configuração.

## 🎯 Objetivos de desenvolvimento

O projeto permite aplicar conhecimentos de desenvolvimento full stack, incluindo:

- Desenvolvimento de APIs REST com Java.
- Mapeamento objeto-relacional com JPA e Hibernate.
- Organização do código em camadas.
- Desenvolvimento de interfaces com Angular e TypeScript.
- Integração entre frontend, backend e banco de dados.
- Modelagem de bancos de dados relacionais.
- Gerenciamento de dependências e build com Maven.

## 👨‍💻 Autor

**Kaio Alan Gonçalves Oliveira**

Desenvolvedor Java Júnior em formação, com experiência prática no desenvolvimento de sistemas e interesse em arquitetura de software e aplicações full stack.

- GitHub: [KaioAlanGOliveira](https://github.com/KaioAlanGOliveira)
- Projeto: [WP-CateSys](https://github.com/KaioAlanGOliveira/WP-CateSys)

---

Desenvolvido com foco na organização, manutenção e evolução de um sistema de gerenciamento de catequese.
