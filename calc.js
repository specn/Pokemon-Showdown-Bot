module.exports = {
	calcfunc: function (arg, pokemonarg, statarg, what, con, room, self) {
		try {
			var pokedex = require('./pokedex.js').BattlePokedex;
			var aliases = require('./aliases.js').BattleAliases;
			var movedex = require('./moves.js').BattleMovedex;
		} catch (e) {
			return ['err', 'Si è verificato un errore: riprova fra qualche secondo.'];
		}
		
		var moveType = false;
		var movePower = false;
		var moveCategory = false;
		var ev = -1;
		var iv = -1;
		var itemBoost = 0;
		var boost = 0;
		var nature = 0;
		var abilityBoost = 0;
		var sandBoost = 0;
		var level = 0;
		
		var evHP = -1;
		
		var item = '';
		var ability = '';
		var statBoost = '';
		
		var natureCheck = '';
		var evCheck = '';
		var ivCheck = '';
		var boostCheck = '';
		var levelCheck = '';
		
		for (var i in arg) {
			if (arg[i].substring(0, 6) == 'natura' && what == 'stat') {
				if (nature == 0) {
					if      (arg[i].substring(6) == 'favorevole')  nature = 1.1;
					else if (arg[i].substring(6) == 'neutra') nature = 1;
					else if (arg[i].substring(6) == 'sfavorevole') nature = 0.9;
					else return ['err', 'Per specificare la natura scegli tra natura favorevole, natura sfavorevole, natura neutra'];
				}
				else return ['err', 'Errore: hai specificato più di una volta la natura'];
			}
			else if ((arg[i].substring(arg[i].length - 1) == '+' || arg[i].substring(arg[i].length - 1) == '-') && what == 'stat') {
				if (nature == 0) {
					if (ev == -1) {
						evCheck = Number(arg[i].substring(0, arg[i].length - 1));
						if (evCheck >= 0 && evCheck <= 252) ev = evCheck;
						else return ['err', 'Numero di EV non valido.'];
						natureCheck = arg[i].substring(arg[i].length - 1);
						if      (natureCheck == '+') nature = 1.1;
						else if (natureCheck == '-') nature = 0.9;
						else return ['err', 'Si è verificato un errore'];
					}
					else return ['err', 'Errore: hai specificato più di una volta gli ev'];
				}
				else return ['err', 'Errore: hai specificato più di una volta la natura'];
			}
			else if (arg[i].substring(arg[i].length - 2) == 'ev') {
				if (ev == -1) {
					evCheck = Number(arg[i].substring(0, arg[i].length - 2));
					if (evCheck >= 0 && evCheck <= 252) ev = evCheck;
					else return ['err', "Numero di EV non valido."];
				}
				else return ['err', 'Errore: hai specificato più di una volta gli ev'];
			}
			else if (arg[i].substring(arg[i].length - 2) == 'iv') {
				if (iv == -1) {
					ivCheck = Number(arg[i].substring(0, arg[i].length - 2));
					if (ivCheck >= 0 && ivCheck <= 31) iv = ivCheck;
					else return ['err', "Numero di IV non valido."];
				}
				else return ['err', 'Errore: hai specificato più di una volta gli iv'];
			}
			else if (arg[i] == 'choiceband' || arg[i] == 'choicebanded' || arg[i] == 'band' || arg[i] == 'banded') {
				if (itemBoost == 0) {
					if (statarg == 'atk') {
						itemBoost = 1.5;
						item = 'Choice Band';
					}
					else return ['err', 'La Choice Band non influenza la statistica ' + statarg];
				}
				else return ['err', 'Errore: hai specificato più di un item'];
			}
			else if (arg[i] == 'choicespecs' || arg[i] == 'choicespecsed' || arg[i] == 'specs' || arg[i] == 'specsed') {
				if (itemBoost == 0) {
					if (statarg == 'spa') {
						itemBoost = 1.5;
						item = 'Choice Specs';
					}
					else return ['err', 'La Choice Specs non influenza la statistica ' + statarg];
				}
				else return ['err', 'Errore: hai specificato più di un item'];
			}
			else if (arg[i] == 'assaultvest' || arg[i] == 'vest') {
				if (itemBoost == 0) {
					if (statarg == 'spd') {
						itemBoost = 1.5;
						item = 'Assault Vest';
					}
					else return ['err', 'L\'Assault Vest non influenza la statistica ' + statarg];
				}
				else return ['err', 'Errore: hai specificato più di un item'];
			}
			else if (arg[i] == 'choicescarf' || arg[i] == 'choicescarfed' || arg[i] == 'scarf' || arg[i] == 'scarfed') {
				if (itemBoost == 0) {
					if (statarg == 'spe') {
						itemBoost = 1.5;
						item = 'Choice Scarf';
					}
					else return ['err', 'La Choice Scarf non influenza la statistica ' + statarg];
				}
				else return ['err', 'Errore: hai specificato più di un item'];
			}
			else if (arg[i] == 'quickpowder') {
				if (itemBoost == 0) {
					if (pokemonarg == 'ditto') {
						if (statarg == 'spe') {
							itemBoost = 2;
							item = 'Quick Powder';
						}
						else return ['err', 'La Quick Powder non influenza la statistica ' + statarg];
					}
					else return ['err', 'La Quick Powder ha effetto solo su Ditto; su ' + pokedex[pokemonarg].species + ' è inutile'];
				}
				else return ['err', 'Errore: hai specificato più di un item'];
			}
			else if (arg[i] == 'ironball') {
				if (itemBoost == 0) {
					if (statarg == 'spe') {
						itemBoost = 0.5;
						item = 'Iron Ball';
					}
					else return ['err', 'L\'Iron Ball non influenza la statistica ' + statarg];
				}
				else return ['err', 'Errore: hai specificato più di un item'];
			}
			else if (arg[i] == 'lightball') {
				if (itemBoost == 0) {
					if (pokemonarg == 'pikachu') {
						if (statarg == 'atk' || statarg == 'spa') {
							itemBoost = 2;
							item = 'Light Ball';
						}
						else return ['err', 'La Light Ball non influenza la statistica ' + statarg];
					}
					else return ['err', 'La Light Ball ha effetto solo su Pikachu; su ' + pokedex[pokemonarg].species + ' è inutile'];
				}
				else return ['err', 'Errore: hai specificato più di un item'];
			}
			else if (arg[i] == 'eviolite' || arg[i] == 'evio') {
				if (itemBoost == 0) {
					if (pokedex[pokemonarg].evos) {
						if (statarg == 'def' || statarg == 'spd') {
							itemBoost = 1.5;
							item = 'Eviolite';
						}
						else return ['err', 'L\'Eviolite non influenza la statistica ' + statarg];
					}
					else return ['err', 'L\'Eviolite non ha nessun effetto su ' + pokedex[pokemonarg].species];
				}
				else return ['err', 'Errore: hai specificato più di un item'];
			}
			else if (arg[i] == 'souldew') {
				if (itemBoost == 0) {
					if (pokemonarg == 'latios' || pokemonarg == 'latias') {
						if (statarg == 'spa' || statarg == 'spd') {
							itemBoost = 1.5;
							item = 'Soul Dew';
						}
						else return ['err', 'La Soul Dew non influenza la statistica ' + statarg];
					}
					else return ['err', 'La Soul Dew ha effetto solo su Latias e Latios; su ' + pokedex[pokemonarg].species + ' è inutile'];
				}
				else return ['err', 'Errore: hai specificato più di un item'];
			}
			else if (arg[i].substring(0, 1) == '+') {
				if (boost == 0) {
					boostCheck = arg[i].substring(1);
					statBoost = arg[i];
					if (boostCheck == '1') boost = 1;
					else if (boostCheck == '2') boost = 2;
					else if (boostCheck == '3') boost = 3;
					else if (boostCheck == '4') boost = 4;
					else if (boostCheck == '5') boost = 5;
					else if (boostCheck == '6') boost = 6;
					else return ['err', "Boost non valido"];
				}
				else return ['err', 'Errore: hai specificato più di un boost'];
			}
			else if (arg[i].substring(0, 1) == '-') {
				if (boost == 0) {
					boostCheck = arg[i].substring(1);
					statBoost = arg[i];
					if (boostCheck == '1') boost = -1;
					else if (boostCheck == '2') boost = -2;
					else if (boostCheck == '3') boost = -3;
					else if (boostCheck == '4') boost = -4;
					else if (boostCheck == '5') boost = -5;
					else if (boostCheck == '6') boost = -6;
					else return ['err', "Drop non valido"];
				}
				else return ['err', 'Errore: hai specificato più di un boost'];
			}
			else if (arg[i] == 'hugepower' || arg[i] == 'purepower') {
				if (abilityBoost == 0) {
					if (statarg == 'atk') {
						abilityBoost = 2;
						if (arg[i] == 'hugepower') ability = 'Huge Power';
						else if (arg[i] == 'purepower') ability = 'Pure Power';
					}
					else return ['err', 'Huge Power e Pure Power non influenzano la statistica ' + statarg];
				}
				else return ['err', 'Errore: hai specificato più di un\'abilità'];
			}
			else if (arg[i] == 'hustle') {
				if (abilityBoost == 0) {
					if (statarg == 'atk') {
						abilityBoost = 1.5;
						ability = 'Hustle';
					}
					else return ['err', 'Hustle non influenza la statistica ' + statarg];
				}
				else return ['err', 'Errore: hai specificato più di un\'abilità'];
			}
			else if (arg[i] == 'furcoat') {
				if (abilityBoost == 0) {
					if (statarg == 'def') {
						abilityBoost = 2;
						ability = 'Fur Coat';
					}
					else return ['err', 'Fur Coat non influenza la statistica ' + statarg];
				}
				else return ['err', 'Errore: hai specificato più di un\'abilità'];
			}
			else if (arg[i] == 'solarpower') {
				if (abilityBoost == 0) {
					if (statarg == 'spa') {
						abilityBoost = 1.5;
						ability = 'Solar Power';
					}
					else return ['err', 'Solar Power non influenza la statistica ' + statarg];
				}
				else return ['err', 'Errore: hai specificato più di un\'abilità'];
			}
			else if (arg[i] == 'chlorophyll' || arg[i] == 'swiftswim' || arg[i] == 'sandrush') {
				if (abilityBoost == 0) {
					if (statarg == 'spe') {
						abilityBoost = 2;
						if (arg[i] == 'chlorophyll') ability = 'Chlorophyll sotto sun';
						else if (arg[i] == 'swiftswim') ability = 'Swift Swim sotto rain';
						else if (arg[i] == 'sandrush') ability = 'Sand Rush sotto sand';
					}
					else return ['err', 'Chlorophyll, Swift Swim e Sand Rush non influenzano la statistica ' + statarg];
				}
				else return ['err', 'Errore: hai specificato più di un\'abilità'];
			}
			else if (arg[i] == 'sand' || arg[i] == 'sandstorm') {
				if (pokedex[pokemonarg].types.indexOf('Rock') > -1) {
					if (statarg == 'spd') {
						sandBoost = 1.5;
					}
					else return ['err', 'Errore: la sand non influenza la statistica ' + statarg];
				}
				else return ['err', 'Errore: la sand aumenta la difesa speciale solo ai tipi Rock'];
			}
			else if (arg[i].substring(0, 5) == 'level') {
				if (level == 0) {
					levelCheck = arg[i].substring(5);
					if (levelCheck >= 1 && levelCheck <= 100) level = levelCheck;
					else return ['err', "Livello non valido"];
				}
				else return ['err', 'Errore: hai specificato più di una volta il livello'];
			}
			else if (arg[i].substring(0, 7) == 'livello') {
				if (level == 0) {
					levelCheck = arg[i].substring(7);
					if (levelCheck >= 1 && levelCheck <= 100) level = levelCheck;
					else return ['err', "Livello non valido"];
				}
				else return ['err', 'Errore: hai specificato più di una volta il livello'];
			}
			else return ['err', '"' + arg[i] + '" non corrisponde a nessun termine di ricerca'];
		}
		
		return [ev, iv, itemBoost, boost, nature, abilityBoost, level, item, ability, statBoost, sandBoost]
	}
}