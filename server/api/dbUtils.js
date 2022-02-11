const _ = require('lodash');

const whereConvert = where => {
  if(!where) return '';
  return _.reduce(where, (acc, value, key) => {
    if(acc !== ' WHERE ') acc += 'AND ';
    return acc + `${ key }="${ value }" `;
  }, ' WHERE ');
};

const setConvert = newData => {
  if(!newData) return '';
  return _.reduce(newData, (acc, value, key) => {
    if(acc !== ' SET ') acc += ', ';
    return acc + `${ key }="${ value }"`;
  }, ' SET ');
};

module.exports = ({ db }) => ({

  serialize() {
    return new Promise(resolve => db.serialize(resolve))
  },

  select(name, { where } = {}) {
    return new Promise((resolve, reject) => {
      let query = `SELECT * FROM ${ name }`;
      if(where) query += whereConvert(where);
      db.all(query, (err, rows) => resolve({ err, rows }));
    });
  },

  delete(name, { where } = {}) {
    return new Promise(resolve => {
      db.run(`DELETE FROM ${ name + whereConvert(where) }`, resolve);
    })
  },

  update(name, { where, new: newData } = {}) {
    return new Promise(resolve => {
      console.log({ where, newData })
      console.log(`UPDATE ${ name } ${ setConvert(newData) } ${ whereConvert(where) }`)
      db.run(`UPDATE ${ name + setConvert(newData) + whereConvert(where) }`, resolve);
    });
  },

  createTable(name, rows) {
    const extendRows = _.entries(rows).reduce((acc, col) => {
      const type = 'VARCHAR (512)'
      // const type = {
      //   number: 'INT',
      //   string: 'VARCHAR (512)',
      // }[typeof col[1]];
      return acc + `"${ col[0] }" ${ type },`;
    }, '');
    return new Promise(resolve => {
      db.run(`CREATE TABLE ${ name } (${ extendRows.trim().slice(0, -1) })`, err => {
        if(err) console.log(`Err create Table: [${ name }]: ${ err }`);
        else console.log(`Create Table: [${ name }]`);
        resolve()
      });
    })
  },


  putToTable(name, data) {
    return new Promise(resolve => {
      const keys = _.keys(data).join();
      const values = _.values(data).map(v => `"${v}"`).join();
      db.run(`INSERT INTO ${ name }(${ keys }) VALUES(${ values })`, resolve);
    })
  },



});