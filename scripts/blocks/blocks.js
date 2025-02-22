const multiLib = require("multi-lib");

const multi = multiLib.MultiCrafter(GenericCrafter, GenericCrafter.GenericCrafterBuild, "freezer", [
    {
      input: {
        liquids: ["water/2"],
        power: 0.3
      },
      output: {
        items: ["adc-ice-cube/3"]
      },
      craftTime: 80
    },
    {
          input: {
            liquids: ["cryofluid/3"],
            power: 0.4
          },
          output: {
            items: ["adc-cryocube/5"]
          },
          craftTime: 95
        },
        {
          input: {
            liquids: ["water/6", "slag/3"],
            power: 0.6
          },
          output: {
            items: ["adc-cinderblock/4"]
          },
          craftTime: 120
        },
        {
          input: {
            liquids: ["oil/10"]
          },
          output: {
            items: ["coal/4"],
            power: 3
          },
          craftTime: 160
        },
        {
        input: {
            liquids: ["adc-surge-mass/12"]
          },
          output: {
            items: ["adc-surge-stone/2"]
          },
          craftTime: 125
        },
], {
  },
  function Extra() {
    this.draw=function(){
      let region1 = Core.atlas.find("adc-freezer-top")
      Draw.rect(region1, this.x, this.y);
      let region2 = Core.atlas.find("adc-freezer")
      Draw.rect(region2, this.x, this.y);
}
});

const creostoneProjector = new JavaAdapter(ForceProjector, {
  drawPlace(x, y, rotation, valid){
    Draw.color(Vars.player.team().color.cpy().mul(1, 0.75, 0.25, 1));
    Lines.stroke(1);
    Lines.square(x * Vars.tilesize + this.offset, y * Vars.tilesize + this.offset, this.radius);

    Draw.color(Vars.player.team().color.cpy().mul(1, 0.25, 0.25, 1));
    Lines.stroke(1);
    Lines.square(x * Vars.tilesize + this.offset, y * Vars.tilesize + this.offset, this.radius + this.phaseRadiusBoost);
    Draw.color();
  }
}, "creostone-wall-huge");

creostoneProjector.consumes.item(Items.phaseFabric).boost();
creostoneProjector.consumes.power(2);

creostoneProjector.buildType = () => extendContent(ForceProjector.ForceBuild, creostoneProjector, {
    drawShield(){
        if(!this.broken){
            var radius = this.realRadius();

            var flash = 10 * (this.phaseHeat - 0.46);
            flash += flash * Time.delta;

            Draw.color(this.team.color.cpy(), this.team.color.cpy().mul(1, 0.25, 0.25, 1), Mathf.absin(flash, 9, 1));

            Draw.z(Layer.shields);
            if(Core.settings.getBool("animatedshields")){
                Fill.poly(this.x, this.y, 4, radius);
            }else{
                Lines.stroke(1.5);
                Draw.alpha(0.09 + Mathf.clamp(0.08 * this.hit));
                Fill.square(this.x, this.y, radius);
                Draw.alpha(1);
                Lines.square(this.x, this.y, radius);
                Draw.reset();
            }
        }
        Draw.reset();
    }
});

const massDriver = extendContent(MassDriver, "compact-driver", {});
massDriver.bullet = extend(MassDriverBolt, {});

const graphiteWT = extend(PowerTurret, "graphite-wall-turret", {
flags: EnumSet.of(BlockFlag.turret),
});

const coalWT = extend(PowerTurret, "coal-wall-turret", {
flags: EnumSet.of(BlockFlag.turret),
});

const siliconWT = extend(PowerTurret, "silicon-wall-turret", {
flags: EnumSet.of(BlockFlag.turret),
});

const cryocubeWT = extend(PowerTurret, "cryocube-wall-turret", {
flags: EnumSet.of(BlockFlag.extinguisher, BlockFlag.turret),
});

const icecubeWT = extend(PowerTurret, "ice-cube-wall-turret", {
flags: EnumSet.of(BlockFlag.turret),
});

const creostoneWT = extend(PowerTurret, "creotite-wall-turret", {
flags: EnumSet.of(BlockFlag.turret),
});

const cinderblockWT = extend(PowerTurret, "cinderblock-wall-turret", {
flags: EnumSet.of(BlockFlag.turret),
});

const statuses = require("statuses/statuses");

/*const cold = Attribute.add("cold");
Blocks.snow.attributes.set(cold, 0.2);
Blocks.iceSnow.attributes.set(cold, 0.45);
Blocks.ice.attributes.set(cold, 0.7);*/

const powerProduction = 7.5;
const generationType = Stat.basePowerGeneration;
const coreCage = extend(CoreBlock, "core-cage", {
	hasPower: true,
	outputsPower: true,
	consumesPower: false,
	setStats(){
        this.super$setStats();
        this.stats.add(generationType, powerProduction * 60, StatUnit.powerSecond);
    },
    setBars(){
        this.super$setBars();
        this.bars.add("poweroutput", entity => new Bar(() => Core.bundle.format("bar.poweroutput", entity.getPowerProduction() * 60 * entity.timeScale(), 1), () => Pal.powerBar, () => entity.productionEfficiency));
    },
	baseExplosiveness: 10,
	thrusterLength: 46/4,
	flags: EnumSet.of(BlockFlag.core, BlockFlag.generator),
	});
	
const productionEfficiency = 1.0;
coreCage.buildType = () => extendContent(CoreBlock.CoreBuild, coreCage, {
        getPowerProduction(){
            return powerProduction * productionEfficiency;
        }
    });
	
const ledoniteLiquid = extendContent(Floor, "ledonite", {
	isLiquid: true,
	status: statuses.superFreezing,
	statusDuration: 240,
	drownTime: 150,
	speedMultiplier: 0.19,
	lightColor: Color.valueOf("c1f4ff"),
	});
	
const upgPump = extend(Pump, "upgraded-pump", {});

const slagExtractor = extend(Fracker, "slag-extractor", {
	outputsPower: true
});

const sofcm = extend(Separator, "s-of-c-m", {
	load(){
	this.super$load();
	this.region = Core.atlas.find(this.name);
    this.liquidRegion = Core.atlas.find(this.name + "-liquid");
    this.spinnerRegion = Core.atlas.find(this.name + "-spinner");
    /*this.spinnerRegion2 = Core.atlas.find(this.name + "-spinner2");*/
    this.topRegion = Core.atlas.find(this.name + "-top");
    },
    icons(){
    return [
      this.region,
      this.spinnerRegion,
      /*this.spinnerRegion2,*/
      this.topRegion,
      ]
  }
});

sofcm.buildType = () => extendContent(Separator.SeparatorBuild, sofcm, {
	draw(){
      var b = sofcm;
      /*var spinSpeed = 5;*/
      Draw.rect(b.region, this.x, this.y);
      Drawf.liquid(b.liquidRegion, this.x, this.y, this.liquids.total() / b.liquidCapacity, this.liquids.current().color);
      Draw.rect(b.spinnerRegion, this.x, this.y, this.totalProgress * b.spinnerSpeed);
      /*Draw.rect(b.spinnerRegion2, this.x, this.y, -this.totalProgress * spinSpeed);*/
      Draw.rect(b.topRegion, this.x, this.y);
    }
  })
  
var drawSpinSprite = true;
const creostoneSP = extend(SolarGenerator, "creostone-solar-panel", {
load(){
this.super$load();
this.region = Core.atlas.find(this.name);
this.sliderRegion1 = Core.atlas.find(this.name + "-slider1");
},
icons(){
    return [
      this.region,
      this.sliderRegion1
      ]
  }
});

creostoneSP.buildType = () => extendContent(SolarGenerator.SolarGeneratorBuild, creostoneSP, {
draw(){
      var b = creostoneSP;
      var rotatorSpeed = 3;
      Draw.rect(b.region, this.x, this.y);
      if(drawSpinSprite){
      Drawf.spinSprite(b.sliderRegion1, this.x, this.y, -Time.time * rotatorSpeed);
      }
    }
  })

const scarlet = extend(CoreBlock, "scarlet-gem", {
	health: 3400,
	size: 4,
	itemCapacity: 2000,
	unitCapModifier: 2,
	thrusterLength: 34/4,
	researchCostMultiplier: 0.05,
	canPlaceOn(tile, team, rotation){
        return true;
    },
    canBreak(tile){
    	return true;
    },
    setStats(){
this.super$setStats();
if(this.canBeBuilt() && this.requirements.length > 0){
this.stats.add(Stat.buildTime, this.buildCost / 60, StatUnit.seconds);
        }
     }
 });

const tm = extend(AttributeCrafter, "thorium-mine", {
	load(){
this.super$load();
this.region = Core.atlas.find(this.name);
this.liquidRegion = Core.atlas.find(this.name + "-liquid");
this.bottomGlow = Core.atlas.find(this.name + "-bottom-glow");
this.rotatorRegion = Core.atlas.find(this.name + "-rotator");
this.rotatorRegion2 = Core.atlas.find(this.name + "-rotator2");
this.topRegion = Core.atlas.find(this.name + "-top");
},
icons(){
    return [
      this.region,
      this.rotatorRegion,
      this.rotatorRegion2,
      this.topRegion
      ]
  }
});

tm.buildType = () => extendContent(AttributeCrafter.AttributeCrafterBuild, tm, {
draw(){
      var rotateSpeed = 5;
      var rotateSpeed2 = 7;
      var glowAmount = 0.9;
      var glowScale = 3;
      Draw.rect(tm.region, this.x, this.y);
      Drawf.liquid(tm.liquidRegion, this.x, this.y, this.liquids.total() / tm.liquidCapacity, this.liquids.current().color);
      Draw.alpha(Mathf.absin(this.totalProgress, glowScale, glowAmount) * this.warmup);
      Draw.rect(tm.bottomGlow, this.x, this.y);
      Draw.reset();
      if(drawSpinSprite){
      Drawf.spinSprite(tm.rotatorRegion, this.x, this.y, this.totalProgress * rotateSpeed);
      Drawf.spinSprite(tm.rotatorRegion2, this.x, this.y, -this.totalProgress * rotateSpeed2);
      }else{
      Draw.rect(tm.rotatorRegion, this.x, this.y, this.totalProgress * rotateSpeed);
      Draw.rect(tm.rotatorRegion2, this.x, this.y, -this.totalProgress * rotateSpeed2);
      }
      Draw.rect(tm.topRegion, this.x, this.y);
    }
  });

//It works incorrect
/*var bullet2 = Bullets.artilleryIncendiary;
var shots2 = 2;
var inaccuracy2 = 5;
const creomine = extend(ShockMine, "creostone-mine", {
shots: 1,
tendrils: 5
});

creomine.buildType = () => extendContent(ShockMine.ShockMineBuild, creomine, {
	triggered(){
            for(var i = 0; i < creomine.tendrils; i++){
                Lightning.create(this.team, creomine.lightningColor, creomine.damage, this.x, this.y, Mathf.random(360), creomine.length);
            }
                for(var ii = 0; i < creomine.shots; ii++){
                    creomine.bullet.create(this, this.x, this.y, (360 / creomine.shots) * ii + Mathf.random(creomine.inaccuracy));
                }
            for(var iii = 0; iii < shots2; iii++){
                bullet2.create(this, this.x, this.y, (360 / shots2) * iii + Mathf.random(inaccuracy2));
            }
         }
     });*/
     
module.exports = {
  multi: multi,
  upgPump: upgPump
}