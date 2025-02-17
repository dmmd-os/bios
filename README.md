# DmmD OS / BIOS

## Synopsis

This is the source code for the BIOS in my DmmD OS project.

See it live at [https://os.dmmdgm.dev](https://os.dmmdgm.dev)! :3

Although if you're seeing this now, it is most likely offline. That's because... it's still work in progress. Sowwry...

## Set Up

1. Download Source Code

You can get a copy of the source code by cloning this project through git:

```sh
git clone https://github.com/dmmd-os/bios dmmd-bios
```

Or by downloading a copy of the .zip file on Github using the same link above.

2. Install Necessary Dependencies

Navigate to the project directory:

```sh
cd dmmd-bios
```

And install the necessary dependencies, either using npm or bun:

```sh
# With npm installed only:
npm install

# Alternatively with bun installed:
bun install
```

3. Build and Host

By default, the project hosts the project on port `3000`. As of right now, you have to go to the `package.json` file and manually edit it if you wish to host it on another port, sowwry... Regardless, you can build and host the project by running:

```sh
# With npm installed only:
npm run build
npm run serve

# ALternatively with bun installed:
bun run build
bun run serve
```

On the other hand, if you only want to host it locally:

```sh
# With npm installed only:
npm run dev

# Alternatively with bun installed:
bun run dev
```

## Development Dependencies / Environment

| Dependency | Version |
|-|-|
| [Node](https://nodejs.org/en) | 21.5.0 |
| [Bun](https://bun.sh/) | 1.1.20 |
| [TypeScript](https://www.typescriptlang.org/) | 5.6.3 |
| [Vite](https://vite.dev/) | 6.0.9 |
| [Chalk](https://github.com/chalk/chalk) | 5.4.1 |

| Environment | Version |
|-|-|
| [Windows](https://www.microsoft.com/en-us/windows) | 19045.5487 |
| [Visual Studio Code](https://code.visualstudio.com/) | 1.97.1 |

> [!NOTE]
> Listed above are the tools that I use for development and are for debugging only. **This does not mean recommended or minimum set up.**

> Linux eventually; not feeling like switching as of right now though, sorry...

> Yes, I know Chalk is not used as of right now. I'll remove it if I still don't use it by full release.

## Releases and Updates

### Update | February 17th, 2025
- Still trying to finish basic functionality.
- Also populating CHANGELOG.md, README.md, and TODO.md.

> [!NOTE]
> See complete lists in the [CHANGELOG](/CHANGELOG.md) and the [TODO](/TODO.md) files.

## Links

| Name | URL |
|-|-|
| Github | [https://github.com/dmmd-os/bios](https://github.com/dmmd-os/bios) |
| Live Website | [https://os.dmmdgm.dev](https://os.dmmdgm.dev) |