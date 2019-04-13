const tmp = require('tmp');
const { spawnSync } = require('child_process');

const Util = require('../../server/util');

module.exports = function(Diets) {
  Diets.exportDietAnalysis = (dietId, res, cb) => {
    Diets.findById(dietId, (err, diet) => {
      if (err || !diet) {
        cb(Util.createError('Diet not found'));
      } else {
        // make a temporary file for the workbook
        tmp.file({ postfix: '.xlsm' }, (err3, tmpWorkbook) => {
          if (err3) {
            cb(Util.createError('Error making shared temp file'));
          } else {
            const processResult = spawnSync('./ExcelApp', [`${diet.dietId}`, tmpWorkbook], {
              cwd: './lib/DietAnalysisExport/bin'
            });
            if (!processResult || processResult.status !== 0) {
              console.log(processResult);
              cb(Util.createError('Error running export process'));
            } else {
              res.download(tmpWorkbook, 'DietDataAnalysis.xlsm');
            }
          }
        });
      }
    });
  };

  Diets.remoteMethod(
    'exportDietAnalysis',
    {
      description: 'Export a diet analysis spreadsheet',
      accepts: [
        { arg: 'id', type: 'any', required: true },
        {
          arg: 'res', type: 'object', http: { source: 'res' },
        },
      ],
      returns: {
        arg: 'data', type: 'file', root: true,
      },
      http: { verb: 'get', path: '/:id/export-diet-analysis' },
    }
  );
};
