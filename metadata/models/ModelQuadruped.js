"use strict";

const ModelBase = require('./ModelBase');

class ModelQuadruped extends ModelBase {
  constructor(p, s) {
    p = p || [];
    s = s || [];
    const p1 = typeof p[0] !== 'undefined' ? p[0] : 0;
    const p2 = typeof p[1] !== 'undefined' ? p[1] : 0;
    const s1 = typeof s[0] !== 'undefined' ? s[0] : Math.PI * 3 / 4;
    const s2 = typeof s[1] !== 'undefined' ? s[1] : 1;
    const s3 = typeof s[2] !== 'undefined' ? s[2] : 0;
    const s4 = typeof s[3] !== 'undefined' ? s[3] : 0;
    const s5 = typeof s[4] !== 'undefined' ? s[4] : 0;
    const s6 = typeof s[5] !== 'undefined' ? s[5] : 0;

    super();

    this.meshes = [
      {
        name: 'head',
        uv: [[0, 0, 8, 8]],
        position: [-4, -4, -8],
        dimensions: [8, 8, 8],
        scale: p2,
        rotationPoint: [0, 18 - p1, -6],
        rotation: [s5 / (180 / Math.PI), s4 / (180 / Math.PI), 0]
      },
      {
        name: 'body',
        uv: [
          [28, 16, 36, 32],
          [46, 16, 56, 32],
          [46, 8, 56, 16],
          [56, 16, 64, 32],
          [36, 8, 46, 16],
          [36, 16, 46, 32],
        ],
        position: [-5, -10, -7],
        dimensions: [10, 16, 8],
        scale: p2,
        rotationPoint: [0, 17 - p1, 2],
        rotation: [Math.PI / 2, 0, 0]
      },
      {
        name: 'leg1',
        uv: [[0, 16, 4, 20]],
        position: [-2, 0, -2],
        dimensions: [4, p1, 4],
        scale: p2,
        rotationPoint: [-3, 24 - p1, 7],
        rotation: [Math.cos(s1 * 0.6662) * 1.4 * s2, 0, 0]
      },
      {
        name: 'leg2',
        uv: [[0, 16, 4, 20]],
        position: [-2, 0, -2],
        dimensions: [4, p1, 4],
        scale: p2,
        rotationPoint: [3, 24 - p1, 7],
        rotation: [Math.cos(s1 * 0.6662 + Math.PI) * 1.4 * s2, 0, 0]
      },
      {
        name: 'leg3',
        uv: [[0, 16, 4, 20]],
        position: [-2, 0, -2],
        dimensions: [4, p1, 4],
        scale: p2,
        rotationPoint: [-3, 24 - p1, -5],
        rotation: [Math.cos(s1 * 0.6662 + Math.PI) * 1.4 * s2, 0, 0]
      },
      {
        name: 'leg4',
        uv: [[0, 16, 4, 20]],
        position: [-2, 0, -2],
        dimensions: [4, p1, 4],
        scale: p2,
        rotationPoint: [3, 24 - p1, -5],
        rotation: [Math.cos(s1 * 0.6662) * 1.4 * s2, 0, 0]
      },
    ];
  }
}

module.exports = ModelQuadruped;

/* package net.minecraft.src;

import org.lwjgl.opengl.GL11;

public class ModelQuadruped extends ModelBase
{
    public ModelRenderer head;
    public ModelRenderer body;
    public ModelRenderer leg1;
    public ModelRenderer leg2;
    public ModelRenderer leg3;
    public ModelRenderer leg4;
    protected float field_40331_g;
    protected float field_40332_n;

    public ModelQuadruped(int par1, float par2)
    {
        field_40331_g = 8F;
        field_40332_n = 4F;
        head = new ModelRenderer(this, 0, 0);
        head.addBox(-4F, -4F, -8F, 8, 8, 8, par2);
        head.setRotationPoint(0.0F, 18 - par1, -6F);
        body = new ModelRenderer(this, 28, 8);
        body.addBox(-5F, -10F, -7F, 10, 16, 8, par2);
        body.setRotationPoint(0.0F, 17 - par1, 2.0F);
        leg1 = new ModelRenderer(this, 0, 16);
        leg1.addBox(-2F, 0.0F, -2F, 4, par1, 4, par2);
        leg1.setRotationPoint(-3F, 24 - par1, 7F);
        leg2 = new ModelRenderer(this, 0, 16);
        leg2.addBox(-2F, 0.0F, -2F, 4, par1, 4, par2);
        leg2.setRotationPoint(3F, 24 - par1, 7F);
        leg3 = new ModelRenderer(this, 0, 16);
        leg3.addBox(-2F, 0.0F, -2F, 4, par1, 4, par2);
        leg3.setRotationPoint(-3F, 24 - par1, -5F);
        leg4 = new ModelRenderer(this, 0, 16);
        leg4.addBox(-2F, 0.0F, -2F, 4, par1, 4, par2);
        leg4.setRotationPoint(3F, 24 - par1, -5F);
    }

    /**
     * Sets the models various rotation angles then renders the model.
    public void render(Entity par1Entity, float par2, float par3, float par4, float par5, float par6, float par7)
    {
        setRotationAngles(par2, par3, par4, par5, par6, par7);

        if (isChild)
        {
            float f = 2.0F;
            GL11.glPushMatrix();
            GL11.glTranslatef(0.0F, field_40331_g * par7, field_40332_n * par7);
            head.render(par7);
            GL11.glPopMatrix();
            GL11.glPushMatrix();
            GL11.glScalef(1.0F / f, 1.0F / f, 1.0F / f);
            GL11.glTranslatef(0.0F, 24F * par7, 0.0F);
            body.render(par7);
            leg1.render(par7);
            leg2.render(par7);
            leg3.render(par7);
            leg4.render(par7);
            GL11.glPopMatrix();
        }
        else
        {
            head.render(par7);
            body.render(par7);
            leg1.render(par7);
            leg2.render(par7);
            leg3.render(par7);
            leg4.render(par7);
        }
    }

    /**
     * Sets the models various rotation angles.
    public void setRotationAngles(float par1, float par2, float par3, float par4, float par5, float par6)
    {
        head.rotateAngleX = par5 / (180F / (float)Math.PI);
        head.rotateAngleY = par4 / (180F / (float)Math.PI);
        body.rotateAngleX = ((float)Math.PI / 2F);
        leg1.rotateAngleX = MathHelper.cos(par1 * 0.6662F) * 1.4F * par2;
        leg2.rotateAngleX = MathHelper.cos(par1 * 0.6662F + (float)Math.PI) * 1.4F * par2;
        leg3.rotateAngleX = MathHelper.cos(par1 * 0.6662F + (float)Math.PI) * 1.4F * par2;
        leg4.rotateAngleX = MathHelper.cos(par1 * 0.6662F) * 1.4F * par2;
    }
} */
