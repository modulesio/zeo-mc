"use strict";

const ModelBase = require('./ModelBase');

const NAME = 'slime';

class ModelSlime extends ModelBase {
  constructor() {
    super();

    this.meshes = [
      {
        name: 'slimeBodies',
        children: [
          {
            name: 'outer',
            uv: [[0, 0, 8, 8]],
            position: [-4, 16, -4],
            dimensions: [8, 8, 8]
          },
          {
            name: 'inner',
            uv: [[0, 16, 6, 22]],
            position: [-3, 17, -3],
            dimensions: [6, 6, 6]
          },
        ]
      },
      {
        name: 'slimeRightEye',
        uv: [[32, 0, 34, 2]],
        position: [-3.25, 18, -4.5],
        dimensions: [2, 2, 2]
      },
      {
        name: 'slimeLeftEye',
        uv: [[32, 4, 34, 6]],
        position: [1.25, 18, -4.5],
        dimensions: [2, 2, 2]
      },
      {
        name: 'slimeMouth',
        uv: [[32, 8, 33, 9]],
        position: [0, 21, -4.5],
        dimensions: [1, 1, 1]
      },
    ];
  }
}
ModelSlime.NAME = NAME;
ModelSlime.TEXTURE = 'slime/slime';

module.exports = ModelSlime;

// XXX
// var m; function go(i) {game.scene.remove(m); m = MODELS.make('slime', [], [], game); game.scene.add(m); m.position.set(-20, 11, 10); }; go();

/* package net.minecraft.src;

public class ModelSlime extends ModelBase
{
    /** The slime's bodies, both the inside box and the outside box
    ModelRenderer slimeBodies;

    /** The slime's right eye
    ModelRenderer slimeRightEye;

    /** The slime's left eye
    ModelRenderer slimeLeftEye;

    /** The slime's mouth
    ModelRenderer slimeMouth;

    public ModelSlime(int par1)
    {
        slimeBodies = new ModelRenderer(this, 0, par1);
        slimeBodies.addBox(-4F, 16F, -4F, 8, 8, 8);

        if (par1 > 0)
        {
            slimeBodies = new ModelRenderer(this, 0, par1);
            slimeBodies.addBox(-3F, 17F, -3F, 6, 6, 6);
            slimeRightEye = new ModelRenderer(this, 32, 0);
            slimeRightEye.addBox(-3.25F, 18F, -3.5F, 2, 2, 2);
            slimeLeftEye = new ModelRenderer(this, 32, 4);
            slimeLeftEye.addBox(1.25F, 18F, -3.5F, 2, 2, 2);
            slimeMouth = new ModelRenderer(this, 32, 8);
            slimeMouth.addBox(0.0F, 21F, -3.5F, 1, 1, 1);
        }
    }

    /**
     * Sets the models various rotation angles.
    public void setRotationAngles(float f, float f1, float f2, float f3, float f4, float f5)
    {
    }

    /**
     * Sets the models various rotation angles then renders the model.
    public void render(Entity par1Entity, float par2, float par3, float par4, float par5, float par6, float par7)
    {
        setRotationAngles(par2, par3, par4, par5, par6, par7);
        slimeBodies.render(par7);

        if (slimeRightEye != null)
        {
            slimeRightEye.render(par7);
            slimeLeftEye.render(par7);
            slimeMouth.render(par7);
        }
    }
} */
