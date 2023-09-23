const path = require('path');
const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');

const pokemonSpriteSize = 50;

const capitalizeFirstLetter = (orig) => {
    if (orig.length == 0) return orig;
    return [orig[0].toUpperCase(), ...orig.slice(1, orig.length)].join('');
}

const getAllPokemon = async () => {
    const pokemonJson = path.join(__dirname, '../public/assets/json/tempAllPokemon.json');
    if (fs.existsSync(pokemonJson)) {
        console.log('loading details per Pokemon from file');
        const rawdata = fs.readFileSync(pokemonJson);
        const data = JSON.parse(rawdata);
        return data;
    }

    const pokemonApiAllUrl = 'https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0';
    const pokemonApiResult = await fetch(pokemonApiAllUrl);
    const pokemonApiData = await pokemonApiResult.json();

    const pokemonLookup = {};
    console.log('fetching details per Pokemon');
    for (const pkmResult of pokemonApiData.results) {
        const rawdata = await fetch(pkmResult.url);
        const pokeDetails = await rawdata.json();

        if (pokeDetails.name.includes('-mega')) continue;

        const imgOpts = [
            pokeDetails.sprites.other['official-artwork'].front_default,
            pokeDetails.sprites.other.dream_world.front_default,
            pokeDetails.sprites.other.home.front_default,
            pokeDetails.sprites.front_default,
        ];

        const pokeId = String(pokeDetails.id).padStart(4, '0');
        const dataToAdd = {
            id: pokeId,
            name: pokeDetails.name.split('-').map(capitalizeFirstLetter).join('-'),
            image: imgOpts.filter(i => i != null)[0],
        };

        if (pokemonLookup[pokeId]) {
            pokemonLookup[pokeId] = [...pokemonLookup[pokeId], dataToAdd];
        } else {
            pokemonLookup[pokeId] = [dataToAdd];
        }
        process.stdout.write(Object.keys(pokemonLookup).length + ` items fetched of approx. ${pokemonApiData.results.length}\r`);
    }

    console.log('');
    fs.writeFileSync(pokemonJson, JSON.stringify(pokemonLookup, null, 2));

    return pokemonLookup;
}

const getAllGameDetails = async () => {
    const gameDetailsJson = path.join(__dirname, '../public/assets/json/tempGameDetails.json');
    if (fs.existsSync(gameDetailsJson)) {
        console.log('loading details per Generation from file');
        const rawdata = fs.readFileSync(gameDetailsJson);
        const data = JSON.parse(rawdata);
        return data;
    }

    const pokemonApiAllUrl = 'https://pokeapi.co/api/v2/generation?limit=100000&offset=0';
    const pokemonApiResult = await fetch(pokemonApiAllUrl);
    const pokemonApiData = await pokemonApiResult.json();

    const generations = [];
    console.log('fetching details per Generation');
    for (const genResult of pokemonApiData.results) {
        const rawdata = await fetch(genResult.url);
        const genDetails = await rawdata.json();

        const genId = String(genDetails.id).padStart(4, '0');
        const dataToAdd = {
            id: genId,
            name: capitalizeFirstLetter(genDetails.main_region.name),
            pokemon: (genDetails.pokemon_species ?? []).map(gi =>
                String(gi.url.replace('https://pokeapi.co/api/v2/pokemon-species/', '').replace('/', '')).padStart(4, '0')
            )
        };

        generations.push(dataToAdd);
    }

    process.stdout.write(generations.length + " generations fetched\r");
    console.log('');

    const orderedGenerations = generations.sort((a, b) => (a.genId > b.genId) ? 1 : -1);
    fs.writeFileSync(gameDetailsJson, JSON.stringify(orderedGenerations, null, 2));
    return orderedGenerations;
}

const joinPokemonDataIntoOneFile = async () => {
    const pokemonLookup = await getAllPokemon();
    const gameDetails = await getAllGameDetails();

    console.log('data loaded');

    const allPokemon = [];
    let maxId = 0;
    for (const game of gameDetails) {
        for (const pkmId of game.pokemon) {
            allPokemon.push(pkmId);

            const id = parseInt(pkmId);
            if (id > maxId) {
                maxId = id;
            }
        }
    }
    const sqrroot = Math.sqrt(maxId);
    const numCol = Math.ceil(sqrroot);
    const widthInPx = parseInt(numCol * pokemonSpriteSize);

    const meta = {
        totalColumns: numCol,
        canvasWidth: widthInPx,
        itemWidth: pokemonSpriteSize,
    }

    const combined = [];
    for (const game of gameDetails) {
        const orderedPokemonDetails = orderPokemon(pokemonLookup, game.pokemon);
        combined.push({
            ...game,
            pokemon: orderedPokemonDetails.map((p, regionIndex) => {
                const idInt = parseInt(p.id);
                const col = idInt % numCol;
                const row = Math.floor(idInt / numCol);

                const boxIndex = regionIndex % 30;
                const boxCol = (boxIndex % 6) + 1;
                const boxRow = (Math.floor(boxIndex / 6)) + 1;

                return {
                    ...p,
                    row,
                    col,
                    boxCol,
                    boxRow,
                };
            })
        })
    }

    await combinePokemonImagesIntoSingleSprite(combined, numCol);

    const orderedCombined = combined.sort((a, b) => (a.id > b.id) ? 1 : -1);

    const combinedJson = path.join(__dirname, '../public/assets/json/pokemonByGame.json');
    fs.writeFileSync(combinedJson, JSON.stringify(orderedCombined, null, 2));

    const metaJson = path.join(__dirname, '../public/assets/json/meta.json');
    fs.writeFileSync(metaJson, JSON.stringify(meta, null, 2));
}

const orderPokemon = (pokemonLookup, ids) => {
    const orderedPokemonId = ids.sort((a, b) => (a > b) ? 1 : -1);

    const orderedPokemon = [];
    for (const orderedId of orderedPokemonId) {
        const pokemonDetails = pokemonLookup[orderedId];
        orderedPokemon.push(pokemonDetails[0]);
    }

    return orderedPokemon;
}

const combinePokemonImagesIntoSingleSprite = async (combined, numCol) => {
    const pokemonImgPath = path.join(__dirname, '../public/assets/img/pokemon');
    const outputImg = path.join(pokemonImgPath, '0000.png');

    console.log('skipping the generation of a new single sprite');
    return;

    if (fs.existsSync(outputImg)) {
        fs.unlinkSync(outputImg)
    }

    const widthInPx = parseInt(numCol * pokemonSpriteSize);
    const canvas = createCanvas(widthInPx, widthInPx);
    const ctx = canvas.getContext('2d');

    console.log('number of games', combined.length);
    for (const combo of combined) {
        console.log(`\t${combo.name}`, combo.pokemon.length);
        for (const pokemonDetail of combo.pokemon) {
            // const response = await fetch(pokemonDetail.image);
            // const blob = await response.blob();
            // const arrayBuffer = await blob.arrayBuffer();
            // const buffer = Buffer.from(arrayBuffer);
            // await fs.writeFileSync(tempImg, buffer);

            if (pokemonDetail.image == null) {
                pokemonDetail.image = path.join(__dirname, '../public/assets/img/pokeball-loader.png');
            }
            // await fs.writeFileSync(tempImg.replace('temp', pokemonDetail.id), buffer);

            const image = await loadImage(pokemonDetail.image);
            ctx.drawImage(
                image,
                pokemonDetail.col * pokemonSpriteSize,
                pokemonDetail.row * pokemonSpriteSize,
                pokemonSpriteSize,
                pokemonSpriteSize
            );
        }
    }

    try {
        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(outputImg, buffer);
        console.log('spritemap created');
    } catch (e) {
        console.error('Unable to write single aprite', e);
    }
}

joinPokemonDataIntoOneFile();
