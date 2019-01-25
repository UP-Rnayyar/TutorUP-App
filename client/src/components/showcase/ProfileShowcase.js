import React, { Component } from 'react';
import PropTypes from 'prop-types';

// import components
import ProgressSpinner from '../common/ProgressSpinner';
import ProfileItem from './ProfileItem';

// redux imports
import { connect } from 'react-redux';
import { getProfiles } from '../../redux/actions/profileActions';

//new imports
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import SearchIcon from '@material-ui/icons/Search';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state/index';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

// MUI imports
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { Card, Input } from '@material-ui/core';

const styles = {
    card: {
        minWidth: 300,
    },
};

class ProfilesShowcase extends Component {
    constructor(){
        super();
        this.state = {
        data: getProfiles(),
        searching: false,
        searchText: '',
        text: '',
        checkedA: false,
        checkedB: false,
        checkedC: false,
      };
    }

    //Functions then render
    componentDidMount() {
        this.props.getProfiles();
    }
    //for randomizing profiles displayed
    shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;
        while (0 !== currentIndex) {
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;
          // Randomly swap elements.
          temporaryValue = array[currentIndex];
          array[currentIndex] = array[randomIndex];
          array[randomIndex] = temporaryValue;
        }
        return array;
      }
      //an attempt to create a smart search bar
    updateProfilesDisplay(searchedProfiles){
        console.log(searchedProfiles);
        if(searchedProfiles.length > 0){
            this.setState(state => ({
                data: searchedProfiles,
                searching: true
            }));
        }
    }

    handleSearch = text => event => {   
        this.setState({
            [text]: event.target.searchText
        });
        let search_text = event.target.value;
        let profileList = this.props.profile.profiles;
        //generates list based on current search text and profile handles
        let searchList = [];
        for(var prof in profileList){
            let profile = profileList[prof];
            if (profile.handle.length >= search_text.length){
                let c = profile.handle.substring(0, search_text.length).toLowerCase();
                if(c.includes(search_text.toLowerCase())){
                    searchList.push(profile);
                }
            }
        }
        //How to set profiles displayed to searchList??
        this.updateProfilesDisplay(searchList);
    }

    handleCheck = name => event => {
        this.setState({
          [name]: event.target.checked,
        });
      };

    handleChange = name => event => {
        this.setState({
          [name]: event.target.value,
        });
      };

    orderBy = (orderBy) => {
        let profileList = this.props.profile.profiles;

        //Sort Objects by their attributes
        let nameSorted = profileList.sort(function(a,b){
            var nameA=a.handle.toLowerCase(), nameB=b.handle.toLowerCase();
            if (nameA < nameB) //sort string ascending
                return -1 
            if (nameA > nameB)
                return 1
            return 0
        })
        let majorSorted = profileList.sort(function(a,b){
            var majorA = a.major.toLowerCase(), majorB = b.major.toLowerCase()
            if (majorA < majorB) 
                return -1 
            if (majorA > majorB)
                return 1
            return 0
        })
        let statusSorted = profileList.sort(function(a,b){
            var statusA = a.status.toLowerCase(), statusB=b.status.toLowerCase()
            if (statusA < statusB) 
                return -1 
            if (statusA > statusB)
                return 1
            return 0
        })

        let filterType = orderBy;
        if (filterType = 'name')
            console.log(nameSorted);
            this.setState(state => ({
                data: nameSorted,
                type: filterType
            })); 
        if (filterType = 'status')
            this.setState(state => ({
                data: statusSorted,
                type: filterType
            })); 
        if (filterType = 'major')
            this.setState(state => ({
                data: majorSorted,
                type: filterType
            })); 
    }

    render() {
        const { classes } = this.props;
        const { profiles, loading } = this.props.profile;
        let profileItems;

        if (profiles === null || loading) {
            profileItems = (
            <ProgressSpinner />
        )
        }
        else {
            if(this.state.searching == true){
                let data = this.state.data;
                profileItems = profiles.length > 0 ?
                profiles.map(profile => (
                    <ProfileItem key={profile._id} profile={profile} />
                )) : (
                    <div>
                        <h1>No Profiles To List</h1>
                    </div>
                );
            }
            else {
                profileItems = profiles.length > 0 ?
                profiles.map(profile => (
                    <ProfileItem key={profile._id} profile={profile} />
                )) : (
                    <div>
                        <h1>No Profiles To List</h1>
                    </div>
                );
            }
        }
        return (
            <div>
            <header>
                <div>
                    <Grid container spacing={16}>
                        <Grid item xs={12}>
                            <Paper className={classes.paper}>
                                <PopupState variant="popover" popupId="demo-popup-menu">
                                    {popupState => (
                                        <React.Fragment>
                                            <SearchIcon />
                                            <Input id='search' placeholder="Search Tutors" value={this.state.searchText} onChange={this.handleSearch('searchText')}/>
                                            <Button variant="contained" {...bindTrigger(popupState)}>Order by</Button>
                                            <Button variant="contained" {...bindTrigger(popupState)}>Filter by</Button>
                                            <Menu {...bindMenu(popupState)}>
                                                <MenuItem onClick={() => this.orderBy('name')}> First Name</MenuItem>
                                                <MenuItem onClick={() => this.orderBy('major')}> By Major </MenuItem>
                                                <MenuItem onClick={() => this.orderBy('status')}> By Class Standing </MenuItem>
                                            </Menu>
                                            <FormControlLabel
                                                control={
                                                <Checkbox checked={this.state.checkedA} onChange={this.handleCheck('checkedA')} value='checkedA'></Checkbox>
                                              }
                                            label="by Major" 
                                            />
                                             <FormControlLabel
                                                control={
                                                <Checkbox checked={this.state.checkedB} onChange={this.handleCheck('checkedB')} value='checkedB'></Checkbox>
                                              }
                                            label="by Year"
                                            />
                                             <FormControlLabel
                                                control={
                                                <Checkbox checked={this.state.checkedC} onChange={this.handleCheck('checkedC')} value='checkedC'></Checkbox>
                                              }
                                            label="by Status" 
                                            />
                                            <br/>
                                            <Typography align="center" variant="h2"> Tutor Profiles  </Typography>
                                        </React.Fragment>
                                    )}
                                </PopupState>
                            </Paper>
                        </Grid>
                    </Grid>
                </div>
            </header>
            <div>
                <Card className={classes.card}>
                    {profileItems}
                </Card>
            </div>
        </div>
        );
    }
}

ProfilesShowcase.propTypes = {
    profile: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    profile: state.profile
});

export default connect(mapStateToProps, { getProfiles })(withStyles(styles)(ProfilesShowcase))