import bcrypt from 'bcrypt';

const saltRounds = 10; 


async function hashPassword(password:string) {
    try {
      const salt = await bcrypt.genSalt(saltRounds);
      const hash = await bcrypt.hash(password, salt);
      return hash;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  
  async function comparePassword(password:string, hash:string) {
    try {
      const match = await bcrypt.compare(password, hash);
      return match;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  
export { 
    hashPassword,
    comparePassword
  };