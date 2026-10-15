// Used by `npm run deps:major` to list only upgrades that cross a major
// version. Minor and patch upgrades are covered by `npm run deps:minor`.
export default {
  filterResults: (
    packageName,
    { currentVersionSemver, upgradedVersionSemver },
  ) => {
    const currentMajor = parseInt(currentVersionSemver[0]?.major, 10);
    const upgradedMajor = parseInt(upgradedVersionSemver?.major, 10);
    if (Number.isNaN(currentMajor) || Number.isNaN(upgradedMajor)) {
      return true;
    }
    return upgradedMajor > currentMajor;
  },
};
