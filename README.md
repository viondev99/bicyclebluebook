# BicycleBlueBook.com - Website (v3)

The following is the current (as of 2023-06-08) repository for the main bicyclebluebook.com website, including the partner portal. It utilizes the api.bicyclebluebook.com (bbb-core) as the core data source, a development version can be found here: https://api-dev.bicyclebluebook.com/ (inquire w/ the team for credentials).

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Deployment](#deployment)
- [Built With](#built-with)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)

## Getting Started

These instructions will help you set up and run the project on your local machine for development and testing purposes.

### Prerequisites

- Node.js (version v14.21.3)
- npm (version 6.14.18)
- nvm (veresion 0.35.0)
- yarn (version 1.22.19)

### Installation

1. Clone the repository:

```bash
git clone git@bitbucket.org:bicyclebluebook/bbb-web-v3.git
```

2. Navigate to the project directory:

```bash
cd bbb-web-v3
```

3. Install the dependencies:

```bash
nvm use 14
yarn
```

## Usage

1. Clone project

```bash
git clone git@bitbucket.org:bicyclebluebook/bbb-web-v3.git
```

2. Install the dependencies

```bash
yarn
```

3. Run project

```bash
yarn dev
```

4. Develop is main branch on project and have three environment: dev, staging and production

- **build environment dev**

```bash
 yarn build:dev
```

- **build environment staging**

```bash
 yarn build:staging
```

- **build environment production**

```bash
 yarn build:production
```

## Deployment

1. Deployment dev

   - create pull request from develop to dev

2. Deplotment staging

   - merge all the commits you want to build into staging

3. Deployment production
   - merge all the commits you want to build into production

## Built With

Next.js - The React framework used
React - JavaScript library for building user interfaces
[Other dependencies or libraries used]

## Contributing

Briefly describe how others can contribute to your project. Include information about the coding style, pre-commit hooks, and other guidelines.

### Fork the project

1. Create your feature branch (git checkout -b feature/**BBB-[task ID]**)
1. Commit your changes (git commit -m '[**user**][**taskid**]Add some feature' ex: git commit -m'[user][bbb-123] update UI')
1. Push to the branch (git push origin feature/YourFeature)
1. Open a pull request

## License

This project is licensed under the MIT License.

## Acknowledgements

Mention any resources, articles, or contributors you found helpful or inspiring.
