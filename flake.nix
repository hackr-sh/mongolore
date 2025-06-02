{
  description = "mongolore development environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs
            pnpm
            electron
          ];
          shellHook = ''
            # export ELECTRON_SKIP_BINARY_DOWNLOAD=1
            # export ELECTRON_OVERRIDE_DIST_PATH=${pkgs.electron}/lib/electron
            # export ELECTRON_BUILDER_ALLOW_UNRESOLVED_DEPENDENCIES=true
            # export ELECTRON_BUILDER_CACHE_DIR=$HOME/.cache/electron-builder
            echo "mongolore development environment ready!"
          '';
        };

        apps = {
          dev = let
            dev = pkgs.writeShellScript "dev" ''
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
