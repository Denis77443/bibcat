module.exports = (sequelize, dataTypes) => {
 const bibrec = sequelize.define('bibrec', {
   id: {
       type: dataTypes.INTEGER(6).UNSIGNED, 
       primaryKey: true, 
       autoIncrement: true,
       allowNull: false,
       unique: true
   },
   card: {
      type: dataTypes.STRING(1000), 
      allowNull: true
   },
  image: {
    type: dataTypes.BLOB,  
    allowNull: true,
    get () { // define a getter

            if(this.getDataValue('image') !== null)
            return this.getDataValue('image').toString('utf8');
        },
        set(val) {
        
          this.setDataValue('image', val);
        }
  },
   auths: {
       type: dataTypes.STRING(32), 
       allowNull: true
  },
  izmiran: {
    type:dataTypes.TINYINT(1), 
    allowNull: true
  },
  title: {
       type: dataTypes.STRING(80), 
       allowNull: true
   },
   year: {
       type: dataTypes.CHAR(4), 
       allowNull: true
   }
 }, {
    timestamps: false,
    charset: 'utf8',
    collate: 'utf8_unicode_ci'
})
 return bibrec
}
