set -e
echo "Enter release version: "
read VERSION

read -p "Version $VERSION is gonna be released - are you sure ? (y/n)" -n 1 -r
echo 
if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo "Releasing version $VERSION ..."

    # Checkout master branch
    git checkout master

    # Test
    echo "Building and executing UNIT TESTS ..."
    npm run test
    npm run karma
    echo "Done."

    # Build & Bump
    echo "Bumping main file and building dist files"
    VERSION=$VERSION ENV='production' npm run pump:main
    VERSION=$VERSION ENV='production' npm run build:dev
    VERSION=$VERSION ENV='production' npm run build:min
    VERSION=$VERSION ENV='production' npm run build:umd
    echo "Done."

    # Commit
    echo "Commiting and bumping package.json ..."
    git add -A
    git commit -m "Build v$VERSION"
    npm version $VERSION --message "Bump package.json v$VERSION"
    echo "Done."

    # Publish
    echo "Publishing new release ..."
    git push origin refs/tags/v$VERSION
    git push origin master
    npm publish
    echo "Done."
fi
