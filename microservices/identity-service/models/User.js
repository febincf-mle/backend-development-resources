const mongoose = require("mongoose");
const argon2 = require("argon2");


const userSchema = new mongoose.Schema({
    display_name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });


userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await argon2.hash(this.password);
    }
});


userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await argon2.verify(this.password, candidatePassword);
    } catch(error) {
        throw error;
    }
};

userSchema.index({ display_name: 'text' });
module.exports = mongoose.model('User', userSchema);
