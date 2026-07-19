import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  //slug: { type: String, required: true, unique: true },  Adicionado campo slug
  slug: {
    type: String,
    required: true,
    unique: true,
    match: /^[a-z0-9-]+$/, // Garantir que apenas letras minúsculas, números e hífens sejam usados
  },
  image: String,
  emailVerified: Date,
  role: { type: String, enum: ["user", "admin"], default: "user" },
  subscriptionTier: { type: String, enum: ["free", "paid", "premium"], default: "free" },
  subscriptionStatus: { type: String, enum: ["active", "past_due", "canceled", "trialing"], default: "active" },
  subscriptionPastDueSince: { type: Date, default: null },
  manualTierOverride: { type: Boolean, default: false },
  resetToken: String,
  resetTokenExpiry: Date,
  // Campos de configurações de notificações
  emailNotifications: { type: Boolean, default: false },
  paymentReminders: { type: Boolean, default: false },
  reportAlerts: { type: Boolean, default: false },
  revenueThreshold: { type: Number, default: 1000 },
  /* portfolioTemplate: { type: String, enum: ["default", "template1", "template2", "template3"], default: "default" }, */
  portfolioTemplate: {
    type: String,
    enum: ["default", "template1", "template2", "template3", "template4", "template5", "template6", "template7", "template8", "template9", "template10", "template11", "template12", "template13", "template14", "template15", "template16", "template17"],
    default: "default"
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Middleware para validar e normalizar o slug antes de salvar
userSchema.pre("save", async function (this: any, next: any) {
  // Garante que o portfolioTemplate seja válido (evita erro de enum com string vazia)
  if (!this.portfolioTemplate) {
    this.portfolioTemplate = "default";
  }

  if (!this.slug || this.isModified("name") || this.isNew) {
    const baseSlug = this.name
      ?.toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    if (!baseSlug) {
      return next(new Error("Nome inválido para gerar o slug."));
    }

    let uniqueSlug = baseSlug;
    let count = 1;

    // Garante que o slug seja único
    while (await (this.constructor as mongoose.Model<any>).findOne({ slug: uniqueSlug, _id: { $ne: this._id } })) {
      uniqueSlug = `${baseSlug}-${count}`;
      count++;
    }

    this.slug = uniqueSlug;
  }
  next();
});

export const User = mongoose.models.User || mongoose.model("User", userSchema);
