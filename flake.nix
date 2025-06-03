{
  description = "mongolore development environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    {
      self,
      nixpkgs,
      flake-utils,
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = import nixpkgs {
          inherit system;
        };

        inherit (pkgs) lib stdenv;

        # Node.js version
        nodejs = pkgs.nodejs_22;

        # Dependencies for native modules
        buildInputs =
          with pkgs;
          [
            # Basic build tools
            gcc
            gnumake
            pkg-config

            # Libraries that Electron might need
            libsecret
            # libxkbfile
            xorg.libX11
            xorg.libxcb
            xorg.libXcomposite
            xorg.libXcursor
            xorg.libXdamage
            xorg.libXext
            xorg.libXfixes
            xorg.libXi
            xorg.libXrandr
            xorg.libXrender
            xorg.libXScrnSaver
            xorg.libXtst
            nss
            nspr
            atk
            at-spi2-atk
            gtk3
            pango
            cairo
            gdk-pixbuf
            glib
            alsa-lib
            cups
          ]
          ++ lib.optionals stdenv.isDarwin (
            with darwin.apple_sdk.frameworks;
            [
              AppKit
              CoreServices
              CoreText
              CoreGraphics
              Foundation
            ]
          );
      in
      {
        devShells.default = pkgs.mkShell {
          inherit buildInputs;

          nativeBuildInputs = with pkgs; [
            pnpm
            nodejs
            nodePackages.npm
            python3 # Needed for some node-gyp builds
            # Use system electron but with proper linking
            (electron.overrideAttrs (oldAttrs: {
              buildInputs = oldAttrs.buildInputs or [] ++ [ stdenv.cc.cc.lib ];
            }))
          ];

          # Environment variables for Electron compatibility
          shellHook = ''
            export NODE_PATH="${nodejs}/lib/node_modules"
            export npm_config_nodedir="${nodejs}"
            export ELECTRON_OVERRIDE_DIST_PATH="${pkgs.electron}/bin"
            export ELECTRON_SKIP_BINARY_DOWNLOAD="1"

            # Ensure proper LD_LIBRARY_PATH for Electron
            export LD_LIBRARY_PATH="${lib.makeLibraryPath buildInputs}:${stdenv.cc.cc.lib}/lib:$LD_LIBRARY_PATH"

            # Use NIX_LD for dynamic linking compatibility
            export NIX_LD_LIBRARY_PATH="${lib.makeLibraryPath buildInputs}"
            export NIX_LD=$(cat ${stdenv.cc}/nix-support/dynamic-linker)

            # Add glib to library path specifically for Electron
            export LD_LIBRARY_PATH="${pkgs.glib.out}/lib:$LD_LIBRARY_PATH"

            echo "🚀 mongolore development environment ready!"
          '';
        };

        apps = {
          dev = let
            dev = pkgs.writeShellScript "dev" ''
              export NIX_LD=$(cat ${stdenv.cc}/nix-support/dynamic-linker)
              export NIX_LD_LIBRARY_PATH="${lib.makeLibraryPath buildInputs}"

              electron_version=$(find node_modules -path "*/electron/dist/electron" | head -1 | sed 's/.*electron@//' | sed 's|/node_modules/electron/dist/electron||')
              echo "Electron version: $electron_version"
              cp node_modules/.pnpm/electron@$electron_version/node_modules/electron/dist/electron \
                node_modules/.pnpm/electron@$electron_version/node_modules/electron/dist/electron.original

              # Remove original
              rm node_modules/.pnpm/electron@$electron_version/node_modules/electron/dist/electron

              # Create wrapper script
              cat > node_modules/.pnpm/electron@$electron_version/node_modules/electron/dist/electron << 'EOF'
              #!/usr/bin/env bash
              export NIX_LD_LIBRARY_PATH="${lib.makeLibraryPath (buildInputs ++ [ pkgs.glib ])}"
              export LD_LIBRARY_PATH="$NIX_LD_LIBRARY_PATH:$LD_LIBRARY_PATH"
              exec ${pkgs.electron}/bin/electron --no-sandbox "$@"
              EOF

              # Make executable
              chmod +x node_modules/.pnpm/electron@$electron_version/node_modules/electron/dist/electron

              ${pkgs.pnpm}/bin/pnpm install
              ${pkgs.pnpm}/bin/pnpm dev
            '';
          in
            {
              type = "app";
              program = "${dev}";
            };
        };
      }
    );
}
