# update-local usage example: {{{1
#
#   update-local TXF_AGENT $TXF_AGENT TXF_AGENT_SECRET $TXF_AGENT_SECRET
#
update-local () {
  local GK=$1
  local GV=$2
  local SK=$3
  local SV=$4
  local FILE='./.env.dist'
  local U1="$GK = <Stellar public key>"
  local U2="$SK = <Stellar secret key>"
  echo "- updating ${FILE} with:"
  echo "  $GK        = $GV"
  echo "  $SK = $SV"

  cat ${FILE}.template | sed -e "s/${U1}/${U1} # ${GV}/g" \
    -e "s/${U2}/${U2} # ${SV}/g" > ${FILE}
}

# update-pms-smart-nft-00 usage example: {{{1
#
#   update-pms-smart-nft-00  TXF_AGENT $TXF_AGENT
#
# TODO use update-public instead
#
update-pms-smart-nft-00 () {
  local GK=$1
  local GV=$2
  local FILE='../pms-smart-nft-00/.env.dist.template'
  local UPDATE="$GK = <Stellar public key>"
  echo
  echo "- updating '${UPDATE}' in ${FILE} with:"
  echo "  ${UPDATE} # ${GV}"

  cat ${FILE} | sed -e "s/${UPDATE}/${UPDATE} # ${GV}/g" > ${FILE}.updated
  mv ${FILE}.updated ${FILE}
}

# update-stellar-smart-contracts usage example: {{{1
#
#   update-stellar-smart-contracts  TXF_AGENT $TXF_AGENT
#
# TODO use update-public instead
#
update-stellar-smart-contracts () {
  local GK=$1
  local GV=$2
  local FILE='../stellar-smart-contracts/.env.dist.template'
  local UPDATE="$GK = <Stellar public key>"
  echo
  echo "- updating '${UPDATE}' in ${FILE} with:"
  echo "  ${UPDATE} # ${GV}"

  cat ${FILE} | sed -e "s/${UPDATE}/${UPDATE} # ${GV}/g" > ${FILE}.updated
  mv ${FILE}.updated ${FILE}
}

# line-count usage example: {{{1
#
#   [ $(line-count ./.env TXF_AGENT) -gt 0 ]
#
line-count () {
  cat $1 | grep $2 | wc -l | xargs
}

# item-count usage example: {{{1
#
#   [ $(item-count ./.env.dist.template TXF_AGENT '\# G') -gt 0 ]
#
item-count () {
  cat $1 | grep $2 | grep "$3" | wc -l | xargs
}

