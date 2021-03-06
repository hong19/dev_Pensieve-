'use strict';
module.exports = (sequelize, DataTypes) => {

  const units = sequelize.define('units', {
    id_author: DataTypes.INTEGER,
    url_pic_layer0: DataTypes.STRING,
    url_pic_layer1: DataTypes.STRING,
    id_primer: DataTypes.INTEGER,
    createdAt: DataTypes.DATE //notice! this line is neccessary cuase we would select it as a params
  }, {
    paranoid: true
  });
  units.associate = function(models) {
    units.belongsTo(models.users, {
      foreignKey:"id_author",
      targetKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    units.hasMany(models.marks, {
      foreignKey:"id_unit",
      sourceKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    units.hasMany(models.attribution, {
      foreignKey:"id_unit",
      sourceKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    units.hasMany(models.notifications, {
      foreignKey:"id_unit",
      sourceKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    units.hasMany(models.notifi_inspired, {
      foreignKey:"id_unit",
      sourceKey: "id",
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  };
  return units;
};
